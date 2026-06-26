package com.ridepool.backend.service;

import com.ridepool.backend.dto.*;
import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.*;
import com.ridepool.backend.repository.*;
import com.ridepool.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final EmailOtpRepository emailOtpRepository;
    private final PhoneOtpRepository phoneOtpRepository;
    private final EcoTrackerRepository ecoTrackerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final SmsService smsService;
    private final OtpService otpService;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already registered");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new AppException("Phone already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .name(request.getName())
            .phoneVerified(true) 
                .verificationStatus(request.getRole() == Role.RIDER
                        ? VerificationStatus.PENDING
                        : VerificationStatus.APPROVED)
                .build();

        userRepository.save(user);
        ecoTrackerRepository.save(EcoTracker.builder().user(user).build());
    }

    @Transactional
    public void sendEmailOtp(String email) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found with this email"));

        String code = otpService.generateCode();
        emailOtpRepository.save(EmailOtp.builder()
                .email(email)
                .code(code)
                .expiresAt(otpService.expiry())
                .build());
        emailService.sendOtp(email, code);
    }

    @Transactional
    public void verifyEmail(String email, String code) {
        EmailOtp otp = emailOtpRepository.findTopByEmailAndUsedFalseOrderByExpiresAtDesc(email)
                .orElseThrow(() -> new AppException("No OTP found"));
        otpService.validateEmailOtp(otp, code);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        user.setEmailVerified(true);
        otp.setUsed(true);
        userRepository.save(user);
        emailOtpRepository.save(otp);
    }

    @Transactional
    public void sendPhoneOtp(String phone) {
        userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException("User not found with this phone"));

        String code = otpService.generateCode();
        phoneOtpRepository.save(PhoneOtp.builder()
                .phone(phone)
                .code(code)
                .expiresAt(otpService.expiry())
                .build());
        smsService.sendOtp(phone, code);
    }

    @Transactional
    public void verifyPhone(String phone, String code) {
        PhoneOtp otp = phoneOtpRepository.findTopByPhoneAndUsedFalseOrderByExpiresAtDesc(phone)
                .orElseThrow(() -> new AppException("No OTP found"));
        otpService.validatePhoneOtp(otp, code);

        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException("User not found"));
        user.setPhoneVerified(true);
        otp.setUsed(true);
        userRepository.save(user);
        phoneOtpRepository.save(otp);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException("Invalid credentials");
        }
        // if (!user.isEmailVerified()) {
        //     throw new AppException("Verify email and phone first");
        // }
         if (user.getRole() != Role.ADMIN && !user.isEmailVerified()) {
        throw new AppException("Verify email and phone first");
       }
        if (user.isBlocked()) {
            throw new AppException("Account blocked");
        }
        if (user.getRole() == Role.RIDER && user.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new AppException("Rider not yet verified by admin");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .name(user.getName())
                .build();
    }
}
