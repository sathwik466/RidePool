package com.ridepool.backend.controller;

import com.ridepool.backend.dto.ApiResponse;
import com.ridepool.backend.dto.ReportRequest;
import com.ridepool.backend.dto.ReviewRequest;
import com.ridepool.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ApiResponse<String> submitReview(Authentication authentication, @RequestBody ReviewRequest request) {
        reviewService.submitReview(authentication.getName(), request);
        return ApiResponse.ok("Review submitted");
    }

    @PostMapping("/report")
    public ApiResponse<String> reportUser(Authentication authentication, @RequestBody ReportRequest request) {
        reviewService.reportUser(authentication.getName(), request);
        return ApiResponse.ok("User reported");
    }
}
