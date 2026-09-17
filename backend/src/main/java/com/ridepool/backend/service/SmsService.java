package com.ridepool.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {

    public void sendOtp(String to, String code) {
        log.info("[SMS OTP] To: {} | Code: {} | Message: Your RidePool OTP is: {}", to, code, code);
    }

    public void sendAlert(String to, String body) {
        log.info("[SMS ALERT] To: {} | Message: {}", to, body);
    }
}
