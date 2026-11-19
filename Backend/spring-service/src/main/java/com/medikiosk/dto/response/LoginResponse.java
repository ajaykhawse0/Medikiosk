package com.medikiosk.dto.response;
import lombok.*;
import java.util.UUID;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoginResponse {
    private UUID userId;
    private String name;
    private String email;
    private String role;
    private boolean mustChangePassword;
    private String accessToken;
    private String refreshToken;
}
