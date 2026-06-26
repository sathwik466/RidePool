package com.ridepool.backend.dto;

import lombok.Data;

@Data
public class SosRequest {

    private Long bookingId;
    private Double lat;
    private Double lng;
}
