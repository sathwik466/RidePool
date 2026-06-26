package com.ridepool.backend.repository;

import com.ridepool.backend.model.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findTopByEmailAndUsedFalseOrderByExpiresAtDesc(String email);
}
