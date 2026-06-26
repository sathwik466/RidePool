package com.ridepool.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rider_id", nullable = false)
    private User rider;

    private String sourceName;
    private Double sourceLat;
    private Double sourceLng;

    private String destName;
    private Double destLat;
    private Double destLng;

    @Column(columnDefinition = "TEXT")
    private String routePolyline;

    private Double distanceKm;

    @Builder.Default
    private Double tollAmount = 0.0;

    private LocalDateTime departureTime;

    private Integer totalSeats;
    private Integer availableSeats;

    @Builder.Default
    private boolean womenOnly = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RecurrenceType recurrence = RecurrenceType.NONE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RideStatus status = RideStatus.ACTIVE;

    private Long parentRideId;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
