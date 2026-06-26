package com.ridepool.backend.service;

import com.ridepool.backend.dto.SosRequest;
import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.Booking;
import com.ridepool.backend.model.SosAlert;
import com.ridepool.backend.model.User;
import com.ridepool.backend.repository.BookingRepository;
import com.ridepool.backend.repository.SosAlertRepository;
import com.ridepool.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SosService {

    private final SosAlertRepository sosAlertRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final SmsService smsService;
    private final EmailService emailService;

    @Transactional
    public void trigger(String email, SosRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException("Booking not found"));

        sosAlertRepository.save(SosAlert.builder()
                .booking(booking)
                .triggeredBy(user)
                .lat(request.getLat())
                .lng(request.getLng())
                .build());

        String body = "SOS ALERT from " + user.getName() + " on RidePool trip #" + booking.getId()
                + ". Location: https://maps.google.com/?q=" + request.getLat() + "," + request.getLng();

        if (user.getEmergencyContactPhone() != null && !user.getEmergencyContactPhone().isBlank()) {
            smsService.sendAlert(user.getEmergencyContactPhone(), body);
        }
        emailService.sendAlert(user.getEmail(), "RidePool SOS Alert", body);
    }

    public void shareTrip(String email, Long bookingId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException("Booking not found"));

        String message = user.getName() + " is on a RidePool trip from "
                + booking.getRide().getSourceName() + " to "
                + booking.getRide().getDestName() + " at "
                + booking.getRide().getDepartureTime();

        if (user.getEmergencyContactPhone() != null && !user.getEmergencyContactPhone().isBlank()) {
            smsService.sendAlert(user.getEmergencyContactPhone(), message);
        }
    }
}
