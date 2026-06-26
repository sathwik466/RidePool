package com.ridepool.backend.dto;

import lombok.Data;

@Data
public class BookingRequest {

    private Long rideId;
    private String pickupName;
    private Double pickupLat;
    private Double pickupLng;
    private Double matchScore;
    private Double detourKm;
}
