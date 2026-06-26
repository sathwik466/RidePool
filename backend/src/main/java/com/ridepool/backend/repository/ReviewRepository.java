package com.ridepool.backend.repository;

import com.ridepool.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeId(Long userId);
    boolean existsByBookingIdAndReviewerId(Long bookingId, Long reviewerId);
}
