package com.ridepool.backend.dto;

import lombok.Data;

@Data
public class TrackingUpdateDto {

    private Long bookingId;
    private Double lat;
    private Double lng;
    private String type;
}
