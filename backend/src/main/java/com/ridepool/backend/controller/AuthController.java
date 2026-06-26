package com.ridepool.backend.controller;

import com.ridepool.backend.dto.*;
import com.ridepool.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.ok("Registered successfully");
    }

    @PostMapping("/send-email-otp")
    public ApiResponse<String> sendEmailOtp(@RequestBody OtpRequest request) {
        authService.sendEmailOtp(request.getEmail());
        return ApiResponse.ok("Email OTP sent");
    }

    @PostMapping("/verify-email")
    public ApiResponse<String> verifyEmail(@RequestBody OtpRequest request) {
        authService.verifyEmail(request.getEmail(), request.getCode());
        return ApiResponse.ok("Email verified");
    }

    @PostMapping("/send-phone-otp")
    public ApiResponse<String> sendPhoneOtp(@RequestBody OtpRequest request) {
        authService.sendPhoneOtp(request.getPhone());
        return ApiResponse.ok("Phone OTP sent");
    }

    @PostMapping("/verify-phone")
    public ApiResponse<String> verifyPhone(@RequestBody OtpRequest request) {
        authService.verifyPhone(request.getPhone(), request.getCode());
        return ApiResponse.ok("Phone verified");
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
