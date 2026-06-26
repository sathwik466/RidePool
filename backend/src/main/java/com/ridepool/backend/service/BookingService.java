package com.ridepool.backend.service;

import com.ridepool.backend.dto.BookingRequest;
import com.ridepool.backend.dto.BookingResponse;
import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.*;
import com.ridepool.backend.repository.BookingRepository;
import com.ridepool.backend.repository.RideRepository;
import com.ridepool.backend.repository.TripLocationRepository;
import com.ridepool.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final TripLocationRepository tripLocationRepository;
    private final FareService fareService;
    private final EcoService ecoService;
    private final RideService rideService;

    @Value("${app.booking.expiry-minutes}")
    private int expiryMinutes;

    public BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .rideId(booking.getRide().getId())
                .commuterId(booking.getCommuter().getId())
                .commuterName(booking.getCommuter().getName())
                .pickupName(booking.getPickupName())
                .pickupLat(booking.getPickupLat())
                .pickupLng(booking.getPickupLng())
                .status(booking.getStatus())
                .fareAmount(booking.getFareAmount())
                .matchScore(booking.getMatchScore())
                .detourKm(booking.getDetourKm())
                .expiresAt(booking.getExpiresAt())
                .confirmedAt(booking.getConfirmedAt())
                .completedAt(booking.getCompletedAt())
                .createdAt(booking.getCreatedAt())
                .ride(rideService.toResponse(booking.getRide()))
                .build();
    }

    @Transactional
    public BookingResponse create(String email, BookingRequest request) {
        User commuter = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new AppException("Ride not found"));

        if (ride.getStatus() != RideStatus.ACTIVE) {
            throw new AppException("Ride is not active");
        }
        if (ride.getAvailableSeats() <= 0) {
            throw new AppException("No seats available");
        }
        if (ride.getRider().getId().equals(commuter.getId())) {
            throw new AppException("Cannot book your own ride");
        }

        var fare = fareService.preview(
                ride.getDistanceKm(),
                ride.getTollAmount() != null ? ride.getTollAmount() : 0.0,
                ride.getTotalSeats()
        );

        Booking booking = Booking.builder()
                .ride(ride)
                .commuter(commuter)
                .pickupName(request.getPickupName())
                .pickupLat(request.getPickupLat())
                .pickupLng(request.getPickupLng())
                .fareAmount(fare.getFarePerSeat())
                .matchScore(request.getMatchScore())
                .detourKm(request.getDetourKm())
                .status(BookingStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusMinutes(expiryMinutes))
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse confirm(Long id, String riderEmail) {
        Booking booking = getBooking(id);
        if (!booking.getRide().getRider().getEmail().equals(riderEmail)) {
            throw new AppException("Only rider can confirm bookings");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new AppException("Booking is not pending");
        }

        Ride ride = booking.getRide();
        if (ride.getAvailableSeats() <= 0) {
            throw new AppException("No seats available");
        }

        ride.setAvailableSeats(ride.getAvailableSeats() - 1);
        rideRepository.save(ride);

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTripOtp(String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000)));
        booking.setConfirmedAt(LocalDateTime.now());

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse complete(Long id, String otp, String email) {
        Booking booking = getBooking(id);
        boolean isRider = booking.getRide().getRider().getEmail().equals(email);
        boolean isCommuter = booking.getCommuter().getEmail().equals(email);
        if (!isRider && !isCommuter) {
            throw new AppException("Unauthorized");
        }
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new AppException("Booking is not confirmed");
        }
        if (booking.getTripOtp() == null || !booking.getTripOtp().equals(otp)) {
            throw new AppException("Invalid trip OTP");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        booking.setCompletedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        ecoService.recordTrip(booking);
        return toResponse(booking);
    }

    @Transactional
    public void cancel(Long id, String email) {
        Booking booking = getBooking(id);
        if (!booking.getCommuter().getEmail().equals(email)
                && !booking.getRide().getRider().getEmail().equals(email)) {
            throw new AppException("Unauthorized");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            Ride ride = booking.getRide();
            ride.setAvailableSeats(ride.getAvailableSeats() + 1);
            rideRepository.save(ride);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new AppException("Booking not found"));
    }

    public BookingResponse getBookingResponse(Long id) {
        return toResponse(getBooking(id));
    }

    public List<BookingResponse> getCommuterBookings(String email) {
        User commuter = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        return bookingRepository.findByCommuterId(commuter.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<BookingResponse> getRiderBookings(String email) {
        User rider = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        return bookingRepository.findByRideRiderId(rider.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void logLocation(Long bookingId, Double lat, Double lng, String type) {
        Booking booking = getBooking(bookingId);
        tripLocationRepository.save(TripLocation.builder()
                .booking(booking)
                .lat(lat)
                .lng(lng)
                .type(type)
                .build());
    }
}
