package com.ridepool.backend.dto;

import com.ridepool.backend.model.Role;
import com.ridepool.backend.model.VerificationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String phone;
    private Role role;
    private String name;
    private String photoUrl;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String licenseNumber;
    private String vehicleNumber;
    private String documentUrl;
    private VerificationStatus verificationStatus;
    private boolean emailVerified;
    private boolean phoneVerified;
    private Double avgRating;
    private Integer karmaPoints;
    private LocalDateTime createdAt;
}
