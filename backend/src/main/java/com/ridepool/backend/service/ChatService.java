package com.ridepool.backend.service;

import com.ridepool.backend.dto.ChatMessageDto;
import com.ridepool.backend.exception.AppException;
import com.ridepool.backend.model.Booking;
import com.ridepool.backend.model.BookingStatus;
import com.ridepool.backend.model.ChatMessage;
import com.ridepool.backend.model.User;
import com.ridepool.backend.repository.BookingRepository;
import com.ridepool.backend.repository.ChatMessageRepository;
import com.ridepool.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ChatMessageDto send(Long bookingId, String email, String content) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException("Booking not found"));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new AppException("Chat is only available for confirmed bookings");
        }

        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));

        ChatMessage message = chatMessageRepository.save(ChatMessage.builder()
                .booking(booking)
                .sender(sender)
                .content(content)
                .build());

        ChatMessageDto dto = toDto(message);
        messagingTemplate.convertAndSend("/topic/chat/" + bookingId, dto);
        return dto;
    }

    public List<ChatMessageDto> getHistory(Long bookingId) {
        return chatMessageRepository.findByBookingIdOrderBySentAtAsc(bookingId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private ChatMessageDto toDto(ChatMessage message) {
        return ChatMessageDto.builder()
                .id(message.getId())
                .bookingId(message.getBooking().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .build();
    }
}
