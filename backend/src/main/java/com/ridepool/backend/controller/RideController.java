package com.ridepool.backend.controller;

import com.ridepool.backend.dto.ApiResponse;
import com.ridepool.backend.dto.RideMatch;
import com.ridepool.backend.dto.RideRequest;
import com.ridepool.backend.dto.RideResponse;
import com.ridepool.backend.service.RideService;
import com.ridepool.backend.service.SmartSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;
    private final SmartSearchService smartSearchService;

    @PostMapping
    public RideResponse create(Authentication authentication, @RequestBody RideRequest request) {
        return rideService.createRide(authentication.getName(), request);
    }

    @PutMapping("/{id}")
    public RideResponse update(Authentication authentication, @PathVariable Long id, @RequestBody RideRequest request) {
        return rideService.updateRide(id, authentication.getName(), request);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> cancel(Authentication authentication, @PathVariable Long id) {
        rideService.cancelRide(id, authentication.getName());
        return ApiResponse.ok("Ride cancelled");
    }

    @GetMapping("/my")
    public List<RideResponse> myRides(Authentication authentication) {
        return rideService.getMyRides(authentication.getName());
    }

    @GetMapping("/{id}")
    public RideResponse getRide(@PathVariable Long id) {
        return rideService.toResponse(rideService.getRideEntity(id));
    }

    @GetMapping("/search")
    public List<RideMatch> search(
            @RequestParam(required = false) Double commuterLat,
            @RequestParam(required = false) Double commuterLng,
            @RequestParam(required = false) Double destLat,
            @RequestParam(required = false) Double destLng,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date,
            @RequestParam(defaultValue = "false") boolean womenOnly,
            @RequestParam(defaultValue = "5") int maxDetourKm) {
        return smartSearchService.search(commuterLat, commuterLng, destLat, destLng, date, womenOnly, maxDetourKm);
    }
}
