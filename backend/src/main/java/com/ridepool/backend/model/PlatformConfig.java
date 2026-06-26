package com.ridepool.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "platform_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String configKey;

    private String configValue;
}
