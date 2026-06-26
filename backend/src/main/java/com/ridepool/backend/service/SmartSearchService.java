package com.ridepool.backend.service;

import com.ridepool.backend.dto.RideMatch;
import com.ridepool.backend.model.Ride;
import com.ridepool.backend.model.RideStatus;
import com.ridepool.backend.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;



@Service
@RequiredArgsConstructor
public class SmartSearchService {

    private static final double MAX_DEST_PROXIMITY_KM = 5.0;
    private static final double MAX_PICKUP_PROXIMITY_KM = 10.0;

    private final RideRepository rideRepository;
    private final FareService fareService;

    public List<RideMatch> search(
            Double commuterLat,
            Double commuterLng,
            Double destLat,
            Double destLng,
            LocalDateTime date,
            boolean womenOnly,
            int maxDetourKm) {

        LocalDate searchDate = date != null ? date.toLocalDate() : LocalDate.now();
        LocalDateTime start = searchDate.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return rideRepository.findByStatusAndDepartureTimeAfter(RideStatus.ACTIVE, LocalDateTime.now())
                .stream()
                .filter(ride -> !ride.getDepartureTime().isBefore(start) && ride.getDepartureTime().isBefore(end))
                .filter(ride -> ride.getAvailableSeats() > 0)
                .filter(ride -> !womenOnly || ride.isWomenOnly())
                .filter(ride -> destLat == null || destLng == null
                        || OsmService.haversineKm(ride.getDestLat(), ride.getDestLng(), destLat, destLng) <= MAX_DEST_PROXIMITY_KM)
                .map(ride -> toMatch(ride, commuterLat, commuterLng))
                .filter(match -> match.getDetourKm() <= maxDetourKm)
                .sorted(Comparator.comparing(RideMatch::getMatchScore).reversed())
                .toList();
    }

    private RideMatch toMatch(Ride ride, Double commuterLat, Double commuterLng) {
        double proximityKm = 0;
        double detourKm = 0;
        double pickupLat = ride.getSourceLat();
        double pickupLng = ride.getSourceLng();
        String pickupName = ride.getSourceName();

        if (commuterLat != null && commuterLng != null) {
            proximityKm = OsmService.haversineKm(commuterLat, commuterLng, ride.getSourceLat(), ride.getSourceLng());
            detourKm = Math.max(0, proximityKm - 1.0);
            pickupLat = ride.getSourceLat();
            pickupLng = ride.getSourceLng();
            pickupName = ride.getSourceName();
        }

        double proximityScore = Math.max(0, 1 - (proximityKm / MAX_PICKUP_PROXIMITY_KM));
        double seatScore = (double) ride.getAvailableSeats() / ride.getTotalSeats();
        double ratingScore = ride.getRider().getAvgRating() / 5.0;
        double timeScore = 1.0;
        double matchScore = 0.4 * proximityScore + 0.3 * timeScore + 0.2 * seatScore + 0.1 * ratingScore;

var fare = fareService.preview(
        ride.getDistanceKm().doubleValue(),
        ride.getTollAmount() != null 
                ? ride.getTollAmount().doubleValue() 
                : 0.0,
        ride.getTotalSeats()
);

       return RideMatch.builder()
        .rideId(ride.getId())
        .riderName(ride.getRider().getName())
        .riderRating(ride.getRider().getAvgRating().doubleValue())
        .sourceName(ride.getSourceName())
        .destName(ride.getDestName())
        .departureTime(ride.getDepartureTime())
        .availableSeats(ride.getAvailableSeats())
        .womenOnly(ride.isWomenOnly())
        .distanceKm(ride.getDistanceKm().doubleValue())
        .suggestedPickupLat(pickupLat)
        .suggestedPickupLng(pickupLng)
        .suggestedPickupName(pickupName)
        .detourKm(detourKm)
        .matchScore(matchScore)
        .farePerSeat(fare.getFarePerSeat().doubleValue())
        .build();
    }
}
