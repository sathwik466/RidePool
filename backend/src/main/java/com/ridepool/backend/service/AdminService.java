package com.ridepool.backend.service;

import com.ridepool.backend.dto.UserResponse;
import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.*;
import com.ridepool.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final String FUEL_RATE_KEY = "fuel_rate_per_km";

    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final PlatformConfigRepository platformConfigRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;

    public List<UserResponse> getPendingRiders() {
        return userRepository.findByRoleAndVerificationStatus(Role.RIDER, VerificationStatus.PENDING)
                .stream()
                .map(userService::toResponse)
                .toList();
    }

    @Transactional
    public UserResponse verifyRider(Long id, VerificationStatus status, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found"));
        if (user.getRole() != Role.RIDER) {
            throw new AppException("User is not a rider");
        }
        user.setVerificationStatus(status);
        return userService.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse blockUser(Long id, boolean blocked) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found"));
        user.setBlocked(blocked);
        return userService.toResponse(userRepository.save(user));
    }

    public List<Report> getReports() {
        return reportRepository.findByResolvedFalse();
    }

    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("users", userRepository.count());
        analytics.put("rides", rideRepository.count());
        analytics.put("bookings", bookingRepository.count());
        analytics.put("activeRides", rideRepository.findByStatusAndDepartureTimeAfter(
                RideStatus.ACTIVE, java.time.LocalDateTime.now()).size());
        return analytics;
    }

    @Transactional
    public PlatformConfig updateFuelRate(BigDecimal rate) {
        PlatformConfig config = platformConfigRepository.findByConfigKey(FUEL_RATE_KEY)
                .orElse(PlatformConfig.builder().configKey(FUEL_RATE_KEY).build());
        config.setConfigValue(rate.toString());
        return platformConfigRepository.save(config);
    }
}
