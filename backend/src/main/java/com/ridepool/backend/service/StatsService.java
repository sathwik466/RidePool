package com.ridepool.backend.service;

import com.ridepool.backend.dto.BookingResponse;
import com.ridepool.backend.dto.UserResponse;
import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.EcoTracker;
import com.ridepool.backend.model.User;
import com.ridepool.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final EcoTrackerRepository ecoTrackerRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BookingService bookingService;
    private final UserService userService;

    public EcoTracker getEcoStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        return ecoTrackerRepository.findByUserId(user.getId())
                .orElse(EcoTracker.builder().user(user).co2SavedKg(0.0).tripsShared(0).build());
    }

    public List<UserResponse> getLeaderboard() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getKarmaPoints).reversed())
                .limit(20)
                .map(userService::toResponse)
                .toList();
    }

    public Map<String, Object> getRiderDashboard(String email) {
        List<BookingResponse> bookings = bookingService.getRiderBookings(email);
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("bookings", bookings);
        dashboard.put("totalTrips", bookings.size());
        return dashboard;
    }

    public Map<String, Object> getCommuterDashboard(String email) {
        List<BookingResponse> bookings = bookingService.getCommuterBookings(email);
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("bookings", bookings);
        dashboard.put("totalTrips", bookings.size());
        return dashboard;
    }
}
