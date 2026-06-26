package com.ridepool.backend.service;

import com.ridepool.backend.dto.FarePreviewRequest;
import com.ridepool.backend.dto.FarePreviewResponse;
import com.ridepool.backend.dto.ReceiptResponse;
import com.ridepool.backend.model.Booking;
import com.ridepool.backend.model.Ride;
import com.ridepool.backend.repository.PlatformConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class FareService {

    private static final String FUEL_RATE_KEY = "fuel_rate_per_km";

    private final PlatformConfigRepository platformConfigRepository;

    public BigDecimal getFuelRate() {
        return platformConfigRepository.findByConfigKey(FUEL_RATE_KEY)
                .map(c -> new BigDecimal(c.getConfigValue()))
                .orElse(new BigDecimal("8.0"));
    }

    public FarePreviewResponse preview(FarePreviewRequest request) {
        return preview(request.getDistanceKm(), request.getToll(), request.getSeats());
    }

    public FarePreviewResponse preview(double distanceKm, double toll, int seats) {
        if (seats <= 0) {
            seats = 1;
        }
        BigDecimal fuelRate = getFuelRate();
        BigDecimal total = fuelRate.multiply(BigDecimal.valueOf(distanceKm))
                .add(BigDecimal.valueOf(toll));
        BigDecimal perSeat = total.divide(BigDecimal.valueOf(seats), 2, RoundingMode.HALF_UP);

        return FarePreviewResponse.builder()
                .distanceKm(distanceKm)
                .fuelRate(fuelRate)
                .toll(toll)
                .seats(seats)
                .farePerSeat(perSeat)
                .totalFare(total)
                .build();
    }

    public ReceiptResponse buildReceipt(Booking booking) {
        Ride ride = booking.getRide();
        return ReceiptResponse.builder()
                .bookingId(booking.getId())
                .source(ride.getSourceName())
                .destination(ride.getDestName())
                .distanceKm(ride.getDistanceKm())
                .farePaid(booking.getFareAmount())
                .riderName(ride.getRider().getName())
                .commuterName(booking.getCommuter().getName())
                .completedAt(booking.getCompletedAt())
                .build();
    }
}
