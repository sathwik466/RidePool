package com.ridepool.backend.controller;

import com.ridepool.backend.dto.ApiResponse;
import com.ridepool.backend.dto.ProfileUpdateRequest;
import com.ridepool.backend.dto.UserResponse;
import com.ridepool.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getMe(Authentication authentication) {
        return userService.toResponse(userService.getByEmail(authentication.getName()));
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(Authentication authentication, @RequestBody ProfileUpdateRequest request) {
        return userService.updateProfile(authentication.getName(), request);
    }

    @PostMapping("/photo")
    public ApiResponse<String> uploadPhoto(Authentication authentication, @RequestParam("file") MultipartFile file)
            throws IOException {
        String url = userService.uploadPhoto(authentication.getName(), file);
        return ApiResponse.ok(url);
    }

    @PostMapping("/documents")
    public ApiResponse<String> uploadDocument(Authentication authentication, @RequestParam("file") MultipartFile file)
            throws IOException {
        String url = userService.uploadDocument(authentication.getName(), file);
        return ApiResponse.ok(url);
    }
}
