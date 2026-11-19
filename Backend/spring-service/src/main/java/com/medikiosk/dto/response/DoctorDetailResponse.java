package com.medikiosk.dto.response;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DoctorDetailResponse {
    private UUID doctorId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String accountStatus;
    private boolean enabled;
    private boolean mustChangePassword;
    private String registrationNumber;
    private String specialization;
    private String department;
    private String temporaryPassword;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant lastLoginAt;
}
