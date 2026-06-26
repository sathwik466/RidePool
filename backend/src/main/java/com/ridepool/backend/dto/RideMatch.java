package com.ridepool.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RideMatch {

    private Long rideId;
    private String riderName;
    private Double riderRating;
    private String sourceName;
    private String destName;
    private LocalDateTime departureTime;
    private Integer availableSeats;
    private boolean womenOnly;
    private Double distanceKm;
    private Double suggestedPickupLat;
    private Double suggestedPickupLng;
    private String suggestedPickupName;
    private Double detourKm;
    private Double matchScore;
    private Double farePerSeat;
}
