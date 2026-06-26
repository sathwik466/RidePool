package com.ridepool.backend.dto;

import com.ridepool.backend.model.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {

    private Long id;
    private Long rideId;
    private Long commuterId;
    private String commuterName;
    private String pickupName;
    private Double pickupLat;
    private Double pickupLng;
    private BookingStatus status;
    private BigDecimal fareAmount;
    private Double matchScore;
    private Double detourKm;
    private LocalDateTime expiresAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private RideResponse ride;
}
