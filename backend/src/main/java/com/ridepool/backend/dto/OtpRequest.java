package com.ridepool.backend.dto;

import lombok.Data;

@Data
public class OtpRequest {

    private String email;
    private String phone;
    private String code;
}
