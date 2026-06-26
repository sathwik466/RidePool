package com.ridepool.backend.dto;

import com.ridepool.backend.model.RecurrenceType;
import com.ridepool.backend.model.RideStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RideResponse {

    private Long id;
    private Long riderId;
    private String riderName;
    private Double riderRating;
    private String sourceName;
    private Double sourceLat;
    private Double sourceLng;
    private String destName;
    private Double destLat;
    private Double destLng;
    private String routePolyline;
    private Double distanceKm;
    private Double tollAmount;
    private LocalDateTime departureTime;
    private Integer totalSeats;
    private Integer availableSeats;
    private boolean womenOnly;
    private RecurrenceType recurrence;
    private RideStatus status;
}
