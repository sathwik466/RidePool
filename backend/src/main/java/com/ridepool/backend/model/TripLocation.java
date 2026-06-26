package com.ridepool.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "trip_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    private Double lat;
    private Double lng;
    private String type;

    @Builder.Default
    private LocalDateTime loggedAt = LocalDateTime.now();
}
