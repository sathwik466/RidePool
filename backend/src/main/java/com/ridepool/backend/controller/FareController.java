package com.ridepool.backend.controller;

import com.ridepool.backend.dto.FarePreviewRequest;
import com.ridepool.backend.dto.FarePreviewResponse;
import com.ridepool.backend.service.FareService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fare")
@RequiredArgsConstructor
public class FareController {

    private final FareService fareService;

    @PostMapping("/preview")
    public FarePreviewResponse preview(@RequestBody FarePreviewRequest request) {
        return fareService.preview(request);
    }
}
