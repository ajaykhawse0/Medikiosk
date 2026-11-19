package com.medikiosk.dto.response;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DoctorProfileResponse {
    private UUID userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String registrationNumber;
    private String specialization;
    private String department;
    private boolean mustChangePassword;
    private Instant createdAt;
}
