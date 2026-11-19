package com.medikiosk.dto.response;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserMeResponse {
    private UUID userId;
    private String name;
    private String email;
    private String phoneNumber;
    private String role;
    private boolean mustChangePassword;
    private Instant lastLoginAt;
}
