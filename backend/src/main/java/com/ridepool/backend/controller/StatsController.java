package com.ridepool.backend.controller;

import com.ridepool.backend.dto.UserResponse;
import com.ridepool.backend.model.EcoTracker;
import com.ridepool.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/eco")
    public EcoTracker eco(Authentication authentication) {
        return statsService.getEcoStats(authentication.getName());
    }

    @GetMapping("/karma/leaderboard")
    public List<UserResponse> leaderboard() {
        return statsService.getLeaderboard();
    }

    @GetMapping("/dashboard/rider")
    public Map<String, Object> riderDashboard(Authentication authentication) {
        return statsService.getRiderDashboard(authentication.getName());
    }

    @GetMapping("/dashboard/commuter")
    public Map<String, Object> commuterDashboard(Authentication authentication) {
        return statsService.getCommuterDashboard(authentication.getName());
    }
}
