package com.ridepool.backend.service;

import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.EmailOtp;
import com.ridepool.backend.model.PhoneOtp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OtpService {

    @Value("${app.otp.expiry-minutes}")
    private int expiryMinutes;

    public String generateCode() {
        return String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000));
    }

    public LocalDateTime expiry() {
        return LocalDateTime.now().plusMinutes(expiryMinutes);
    }

    public void validateEmailOtp(EmailOtp otp, String code) {
        if (otp == null || otp.isUsed() || otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException("OTP expired or invalid");
        }
        if (!otp.getCode().equals(code)) {
            throw new AppException("Invalid OTP");
        }
    }

    public void validatePhoneOtp(PhoneOtp otp, String code) {
        if (otp == null || otp.isUsed() || otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException("OTP expired or invalid");
        }
        if (!otp.getCode().equals(code)) {
            throw new AppException("Invalid OTP");
        }
    }
}
