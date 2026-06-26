package com.ridepool.backend.dto;

import lombok.Data;

@Data
public class FarePreviewRequest {

    private double distanceKm;
    private double toll;
    private int seats;
}
