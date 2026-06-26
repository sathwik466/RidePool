package com.ridepool.backend.controller;

import com.ridepool.backend.dto.*;
import com.ridepool.backend.service.BookingService;
import com.ridepool.backend.service.FareService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final FareService fareService;

    @PostMapping
    public BookingResponse create(Authentication authentication, @RequestBody BookingRequest request) {
        return bookingService.create(authentication.getName(), request);
    }

    @GetMapping("/{id}")
    public BookingResponse getBooking(@PathVariable Long id) {
        return bookingService.getBookingResponse(id);
    }

    @GetMapping("/my")
    public List<BookingResponse> myBookings(Authentication authentication) {
        return bookingService.getCommuterBookings(authentication.getName());
    }

    @GetMapping("/rider")
    public List<BookingResponse> riderBookings(Authentication authentication) {
        return bookingService.getRiderBookings(authentication.getName());
    }

    @PutMapping("/{id}/confirm")
    public BookingResponse confirm(Authentication authentication, @PathVariable Long id) {
        return bookingService.confirm(id, authentication.getName());
    }

    @PutMapping("/{id}/complete")
    public BookingResponse complete(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam String otp) {
        return bookingService.complete(id, otp, authentication.getName());
    }

    @PutMapping("/{id}/cancel")
    public ApiResponse<String> cancel(Authentication authentication, @PathVariable Long id) {
        bookingService.cancel(id, authentication.getName());
        return ApiResponse.ok("Booking cancelled");
    }

    @GetMapping("/{id}/receipt")
    public ReceiptResponse receipt(@PathVariable Long id) {
        return fareService.buildReceipt(bookingService.getBooking(id));
    }
}
