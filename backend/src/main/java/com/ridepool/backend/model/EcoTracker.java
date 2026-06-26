package com.ridepool.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "eco_tracker")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EcoTracker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    private Double co2SavedKg = 0.0;

    @Builder.Default
    private Integer tripsShared = 0;
}
