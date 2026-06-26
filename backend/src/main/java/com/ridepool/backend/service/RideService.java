package com.ridepool.backend.service;

import com.ridepool.backend.dto.RideMatch;
import com.ridepool.backend.dto.RideRequest;
import com.ridepool.backend.dto.RideResponse;
import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.*;
import com.ridepool.backend.repository.RideRepository;
import com.ridepool.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final OsmService osmService;
    private final FareService fareService;

    public RideResponse toResponse(Ride ride) {
        return RideResponse.builder()
                .id(ride.getId())
                .riderId(ride.getRider().getId())
                .riderName(ride.getRider().getName())
                .riderRating(ride.getRider().getAvgRating())
                .sourceName(ride.getSourceName())
                .sourceLat(ride.getSourceLat())
                .sourceLng(ride.getSourceLng())
                .destName(ride.getDestName())
                .destLat(ride.getDestLat())
                .destLng(ride.getDestLng())
                .routePolyline(ride.getRoutePolyline())
                .distanceKm(ride.getDistanceKm())
                .tollAmount(ride.getTollAmount())
                .departureTime(ride.getDepartureTime())
                .totalSeats(ride.getTotalSeats())
                .availableSeats(ride.getAvailableSeats())
                .womenOnly(ride.isWomenOnly())
                .recurrence(ride.getRecurrence())
                .status(ride.getStatus())
                .build();
    }

    @Transactional
    public RideResponse createRide(String email, RideRequest request) {
        User rider = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        if (rider.getRole() != Role.RIDER) {
            throw new AppException("Only riders can post rides");
        }

        OsmService.RouteResult route = osmService.getRoute(
                request.getSourceLat(), request.getSourceLng(),
                request.getDestLat(), request.getDestLng()
        );

        Ride ride = Ride.builder()
                .rider(rider)
                .sourceName(request.getSourceName())
                .sourceLat(request.getSourceLat())
                .sourceLng(request.getSourceLng())
                .destName(request.getDestName())
                .destLat(request.getDestLat())
                .destLng(request.getDestLng())
                .routePolyline(route.polyline())
                .distanceKm(route.distanceKm())
                .tollAmount(request.getTollAmount() != null ? request.getTollAmount() : 0.0)
                .departureTime(request.getDepartureTime())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .womenOnly(request.isWomenOnly())
                .recurrence(request.getRecurrence() != null ? request.getRecurrence() : RecurrenceType.NONE)
                .build();

        return toResponse(rideRepository.save(ride));
    }

    @Transactional
    public RideResponse updateRide(Long id, String email, RideRequest request) {
        Ride ride = getOwnedRide(id, email);

        OsmService.RouteResult route = osmService.getRoute(
                request.getSourceLat(), request.getSourceLng(),
                request.getDestLat(), request.getDestLng()
        );

        ride.setSourceName(request.getSourceName());
        ride.setSourceLat(request.getSourceLat());
        ride.setSourceLng(request.getSourceLng());
        ride.setDestName(request.getDestName());
        ride.setDestLat(request.getDestLat());
        ride.setDestLng(request.getDestLng());
        ride.setRoutePolyline(route.polyline());
        ride.setDistanceKm(route.distanceKm());
        ride.setTollAmount(request.getTollAmount() != null ? request.getTollAmount() : 0.0);
        ride.setDepartureTime(request.getDepartureTime());
        ride.setWomenOnly(request.isWomenOnly());
        if (request.getRecurrence() != null) {
            ride.setRecurrence(request.getRecurrence());
        }

        return toResponse(rideRepository.save(ride));
    }

    @Transactional
    public void cancelRide(Long id, String email) {
        Ride ride = getOwnedRide(id, email);
        ride.setStatus(RideStatus.CANCELLED);
        rideRepository.save(ride);
    }

    public List<RideResponse> getMyRides(String email) {
        User rider = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        return rideRepository.findByRiderIdAndStatus(rider.getId(), RideStatus.ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Ride getRideEntity(Long id) {
        return rideRepository.findById(id)
                .orElseThrow(() -> new AppException("Ride not found"));
    }

    private Ride getOwnedRide(Long id, String email) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new AppException("Ride not found"));
        if (!ride.getRider().getEmail().equals(email)) {
            throw new AppException("Not your ride");
        }
        return ride;
    }
}
