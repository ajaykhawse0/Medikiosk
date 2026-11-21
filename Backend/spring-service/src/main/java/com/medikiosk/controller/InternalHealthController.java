package com.medikiosk.controller;

import com.medikiosk.dto.response.InternalHealthResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/internal", "/api/v1/internal"})
public class InternalHealthController {

    @GetMapping("/health")
    public InternalHealthResponse health() {
        return InternalHealthResponse.builder()
                .success(true)
                .service("spring-service")
                .message("Spring Boot service is reachable")
                .build();
    }
}
