package com.ridepool.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class FarePreviewResponse {

    private double distanceKm;
    private BigDecimal fuelRate;
    private double toll;
    private int seats;
    private BigDecimal farePerSeat;
    private BigDecimal totalFare;
}
