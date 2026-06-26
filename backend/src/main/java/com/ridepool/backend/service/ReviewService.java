package com.ridepool.backend.service;

import com.ridepool.backend.dto.ReportRequest;
import com.ridepool.backend.dto.ReviewRequest;
import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.*;
import com.ridepool.backend.repository.BookingRepository;
import com.ridepool.backend.repository.ReportRepository;
import com.ridepool.backend.repository.ReviewRepository;
import com.ridepool.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReportRepository reportRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public void submitReview(String email, ReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException("Booking not found"));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new AppException("Can only review completed trips");
        }

        User reviewer = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));

        if (reviewRepository.existsByBookingIdAndReviewerId(booking.getId(), reviewer.getId())) {
            throw new AppException("Already reviewed this trip");
        }

        User reviewee = booking.getRide().getRider().getId().equals(reviewer.getId())
                ? booking.getCommuter()
                : booking.getRide().getRider();

        reviewRepository.save(Review.builder()
                .booking(booking)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(request.getRating())
                .comment(request.getComment())
                .build());

        double avg = reviewRepository.findByRevieweeId(reviewee.getId()).stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);
        reviewee.setAvgRating(avg);
        userRepository.save(reviewee);
    }

    @Transactional
    public void reportUser(String email, ReportRequest request) {
        User reporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        User reported = userRepository.findById(request.getReportedUserId())
                .orElseThrow(() -> new AppException("Reported user not found"));

        reportRepository.save(Report.builder()
                .reporter(reporter)
                .reported(reported)
                .reason(request.getReason())
                .description(request.getDescription())
                .build());
    }
}
