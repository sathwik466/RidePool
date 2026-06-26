package com.ridepool.backend.controller;

import com.ridepool.backend.dto.UserResponse;
import com.ridepool.backend.model.PlatformConfig;
import com.ridepool.backend.model.Report;
import com.ridepool.backend.model.VerificationStatus;
import com.ridepool.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/riders/pending")
    public List<UserResponse> pendingRiders() {
        return adminService.getPendingRiders();
    }

    @PutMapping("/riders/{id}/verify")
    public UserResponse verifyRider(
            @PathVariable Long id,
            @RequestParam VerificationStatus status,
            @RequestParam(required = false) String reason) {
        return adminService.verifyRider(id, status, reason);
    }

    @PutMapping("/users/{id}/block")
    public UserResponse blockUser(@PathVariable Long id, @RequestParam boolean blocked) {
        return adminService.blockUser(id, blocked);
    }

    @GetMapping("/reports")
    public List<Report> reports() {
        return adminService.getReports();
    }

    @GetMapping("/analytics")
    public Map<String, Object> analytics() {
        return adminService.getAnalytics();
    }

    @PutMapping("/config/fuel-rate")
    public PlatformConfig updateFuelRate(@RequestParam BigDecimal rate) {
        return adminService.updateFuelRate(rate);
    }
}
