package com.ridepool.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String name;
    private String photoUrl;

    private String emergencyContactName;
    private String emergencyContactPhone;

    private String licenseNumber;
    private String vehicleNumber;
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Builder.Default
    private boolean emailVerified = false;

    @Builder.Default
    private boolean phoneVerified = false;

    @Builder.Default
    private boolean blocked = false;

    @Builder.Default
    private Double avgRating = 0.0;

    @Builder.Default
    private Integer karmaPoints = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
