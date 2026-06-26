package com.ridepool.backend.dto;

import com.ridepool.backend.model.RecurrenceType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RideRequest {

    private String sourceName;
    private Double sourceLat;
    private Double sourceLng;
    private String destName;
    private Double destLat;
    private Double destLng;
    private LocalDateTime departureTime;
    private Integer totalSeats;
    private Double tollAmount;
    private boolean womenOnly;
    private RecurrenceType recurrence = RecurrenceType.NONE;
}
