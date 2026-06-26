package com.ridepool.backend.repository;

import com.ridepool.backend.model.TripLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripLocationRepository extends JpaRepository<TripLocation, Long> {
    List<TripLocation> findByBookingIdOrderByLoggedAtAsc(Long bookingId);
}
