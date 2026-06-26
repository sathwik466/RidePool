package com.ridepool.backend.controller;

import com.ridepool.backend.dto.ApiResponse;
import com.ridepool.backend.dto.SosRequest;
import com.ridepool.backend.service.SosService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sos")
@RequiredArgsConstructor
public class SosController {

    private final SosService sosService;

    @PostMapping
    public ApiResponse<String> trigger(Authentication authentication, @RequestBody SosRequest request) {
        sosService.trigger(authentication.getName(), request);
        return ApiResponse.ok("SOS alert sent");
    }

    @PostMapping("/share/{bookingId}")
    public ApiResponse<String> shareTrip(Authentication authentication, @PathVariable Long bookingId) {
        sosService.shareTrip(authentication.getName(), bookingId);
        return ApiResponse.ok("Trip shared with emergency contact");
    }
}
