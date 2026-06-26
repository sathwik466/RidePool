package com.ridepool.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ReceiptResponse {

    private Long bookingId;
    private String source;
    private String destination;
    private Double distanceKm;
    private BigDecimal farePaid;
    private String riderName;
    private String commuterName;
    private LocalDateTime completedAt;
}
