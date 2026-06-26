package com.ridepool.backend.repository;

import com.ridepool.backend.model.EcoTracker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EcoTrackerRepository extends JpaRepository<EcoTracker, Long> {
    Optional<EcoTracker> findByUserId(Long userId);
}
