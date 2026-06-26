package com.ridepool.backend.controller;

import com.ridepool.backend.dto.ChatMessageDto;
import com.ridepool.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;

    @GetMapping("/{bookingId}")
    public List<ChatMessageDto> getHistory(@PathVariable Long bookingId) {
        return chatService.getHistory(bookingId);
    }
}
