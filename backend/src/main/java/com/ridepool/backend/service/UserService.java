package com.ridepool.backend.service;

import com.ridepool.backend.dto.ProfileUpdateRequest;
import com.ridepool.backend.dto.UserResponse;
import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.Role;
import com.ridepool.backend.model.User;
import com.ridepool.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .name(user.getName())
                .photoUrl(user.getPhotoUrl())
                .emergencyContactName(user.getEmergencyContactName())
                .emergencyContactPhone(user.getEmergencyContactPhone())
                .licenseNumber(user.getLicenseNumber())
                .vehicleNumber(user.getVehicleNumber())
                .documentUrl(user.getDocumentUrl())
                .verificationStatus(user.getVerificationStatus())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .avgRating(user.getAvgRating())
                .karmaPoints(user.getKarmaPoints())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional
    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = getByEmail(email);

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getEmergencyContactName() == null || request.getEmergencyContactName().isBlank()) {
            throw new AppException("Emergency contact name is mandatory");
        }
        if (request.getEmergencyContactPhone() == null || request.getEmergencyContactPhone().isBlank()) {
            throw new AppException("Emergency contact phone is mandatory");
        }

        user.setEmergencyContactName(request.getEmergencyContactName());
        user.setEmergencyContactPhone(request.getEmergencyContactPhone());

        if (user.getRole() == Role.RIDER) {
            if (request.getLicenseNumber() != null) {
                user.setLicenseNumber(request.getLicenseNumber());
            }
            if (request.getVehicleNumber() != null) {
                user.setVehicleNumber(request.getVehicleNumber());
            }
        }

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public String uploadPhoto(String email, MultipartFile file) throws IOException {
        User user = getByEmail(email);
        String url = cloudinaryService.upload(file, "photos");
        user.setPhotoUrl(url);
        userRepository.save(user);
        return url;
    }

    @Transactional
    public String uploadDocument(String email, MultipartFile file) throws IOException {
        User user = getByEmail(email);
        if (user.getRole() != Role.RIDER) {
            throw new AppException("Only riders can upload documents");
        }
        String url = cloudinaryService.upload(file, "documents");
        user.setDocumentUrl(url);
        user.setVerificationStatus(com.ridepool.backend.model.VerificationStatus.PENDING);
        userRepository.save(user);
        return url;
    }
}
