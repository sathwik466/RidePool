package com.ridepool.backend.repository;

import com.ridepool.backend.model.Booking;
import com.ridepool.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCommuterId(Long commuterId);
    List<Booking> findByRideRiderId(Long riderId);
    List<Booking> findByStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime now);
    List<Booking> findByRideId(Long rideId);
}
