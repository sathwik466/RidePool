package com.ridepool.backend.config;

import com.ridepool.backend.model.*;
import com.ridepool.backend.repository.EcoTrackerRepository;
import com.ridepool.backend.repository.PlatformConfigRepository;
import com.ridepool.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EcoTrackerRepository ecoTrackerRepository;
    private final PlatformConfigRepository platformConfigRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (platformConfigRepository.findByConfigKey("fuel_rate_per_km").isEmpty()) {
            platformConfigRepository.save(PlatformConfig.builder()
                    .configKey("fuel_rate_per_km")
                    .configValue("8.0")
                    .build());
        }

        if (userRepository.findByEmail("admin@ridepool.com").isEmpty()) {
            User admin = User.builder()
                    .email("admin@ridepool.com")
                    .phone("+919999999999")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .name("Admin")
                    .emailVerified(true)
                    .phoneVerified(true)
                    .verificationStatus(VerificationStatus.APPROVED)
                    .emergencyContactName("Emergency")
                    .emergencyContactPhone("+919999999998")
                    .build();
            userRepository.save(admin);
            ecoTrackerRepository.save(EcoTracker.builder().user(admin).build());
        }
    }
}
