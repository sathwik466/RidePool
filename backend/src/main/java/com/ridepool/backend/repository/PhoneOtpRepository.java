package com.ridepool.backend.repository;

import com.ridepool.backend.model.PhoneOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PhoneOtpRepository extends JpaRepository<PhoneOtp, Long> {
    Optional<PhoneOtp> findTopByPhoneAndUsedFalseOrderByExpiresAtDesc(String phone);
}
