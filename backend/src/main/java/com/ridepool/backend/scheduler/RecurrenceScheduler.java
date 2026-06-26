package com.ridepool.backend.scheduler;

import com.ridepool.backend.model.RecurrenceType;
import com.ridepool.backend.model.Ride;
import com.ridepool.backend.model.RideStatus;
import com.ridepool.backend.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RecurrenceScheduler {

    private final RideRepository rideRepository;

    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void generateRecurringRides() {
        List<Ride> templates = rideRepository.findByRecurrenceNotAndStatus(RecurrenceType.NONE, RideStatus.ACTIVE);

        for (Ride ride : templates) {
            boolean shouldClone = ride.getRecurrence() == RecurrenceType.DAILY
                    || (ride.getRecurrence() == RecurrenceType.WEEKLY
                    && ride.getDepartureTime().getDayOfWeek() == LocalDate.now().getDayOfWeek());

            if (!shouldClone) {
                continue;
            }

            Ride clone = Ride.builder()
                    .rider(ride.getRider())
                    .sourceName(ride.getSourceName())
                    .sourceLat(ride.getSourceLat())
                    .sourceLng(ride.getSourceLng())
                    .destName(ride.getDestName())
                    .destLat(ride.getDestLat())
                    .destLng(ride.getDestLng())
                    .routePolyline(ride.getRoutePolyline())
                    .distanceKm(ride.getDistanceKm())
                    .tollAmount(ride.getTollAmount())
                    .departureTime(ride.getDepartureTime().plusDays(
                            ride.getRecurrence() == RecurrenceType.DAILY ? 1 : 7))
                    .totalSeats(ride.getTotalSeats())
                    .availableSeats(ride.getTotalSeats())
                    .womenOnly(ride.isWomenOnly())
                    .recurrence(ride.getRecurrence())
                    .parentRideId(ride.getId())
                    .status(RideStatus.ACTIVE)
                    .build();

            rideRepository.save(clone);
        }
    }
}
