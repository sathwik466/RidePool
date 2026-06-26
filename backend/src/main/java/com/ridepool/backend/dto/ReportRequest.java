package com.ridepool.backend.dto;

import lombok.Data;

@Data
public class ReportRequest {

    private Long reportedUserId;
    private String reason;
    private String description;
}
