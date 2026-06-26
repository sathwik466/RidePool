package com.ridepool.backend.repository;

import com.ridepool.backend.model.RecurrenceType;
import com.ridepool.backend.model.Ride;
import com.ridepool.backend.model.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByRiderIdAndStatus(Long riderId, RideStatus status);
    List<Ride> findByStatusAndDepartureTimeAfter(RideStatus status, LocalDateTime after);
    List<Ride> findByRecurrenceNotAndStatus(RecurrenceType recurrence, RideStatus status);
}
