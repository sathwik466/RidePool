package com.ridepool.backend.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {

    private String name;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String licenseNumber;
    private String vehicleNumber;
}
