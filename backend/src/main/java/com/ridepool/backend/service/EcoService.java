package com.ridepool.backend.service;

import com.ridepool.backend.model.Booking;
import com.ridepool.backend.model.EcoTracker;
import com.ridepool.backend.model.User;
import com.ridepool.backend.repository.EcoTrackerRepository;
import com.ridepool.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EcoService {

    private static final double CO2_PER_KM_KG = 0.12;
    private static final int KARMA_PER_TRIP = 10;

    private final EcoTrackerRepository ecoTrackerRepository;
    private final UserRepository userRepository;

    @Transactional
    public void recordTrip(Booking booking) {
        double co2Saved = booking.getRide().getDistanceKm() * CO2_PER_KM_KG;
        updateUserEco(booking.getCommuter(), co2Saved);
        updateUserEco(booking.getRide().getRider(), co2Saved);
    }

    private void updateUserEco(User user, double co2Saved) {
        EcoTracker eco = ecoTrackerRepository.findByUserId(user.getId())
                .orElse(EcoTracker.builder().user(user).build());
        eco.setCo2SavedKg(eco.getCo2SavedKg() + co2Saved);
        eco.setTripsShared(eco.getTripsShared() + 1);
        ecoTrackerRepository.save(eco);

        user.setKarmaPoints(user.getKarmaPoints() + KARMA_PER_TRIP);
        userRepository.save(user);
    }
}
