package com.ridepool.backend.controller;

import com.ridepool.backend.dto.ChatMessageDto;
import com.ridepool.backend.dto.TrackingUpdateDto;
import com.ridepool.backend.service.BookingService;
import com.ridepool.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final BookingService bookingService;
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/tracking/{bookingId}")
    public void track(@DestinationVariable Long bookingId, @Payload TrackingUpdateDto update) {
        String type = update.getType() != null ? update.getType() : "LIVE";
        bookingService.logLocation(bookingId, update.getLat(), update.getLng(), type);
        update.setBookingId(bookingId);
        messagingTemplate.convertAndSend("/topic/tracking/" + bookingId, update);
    }

    @MessageMapping("/chat/{bookingId}")
    public void chat(
            @DestinationVariable Long bookingId,
            @Payload ChatMessageDto message) {
        chatService.send(
                bookingId,
                message.getSenderEmail() != null ? message.getSenderEmail() : message.getSenderName(),
                message.getContent());
    }
}
