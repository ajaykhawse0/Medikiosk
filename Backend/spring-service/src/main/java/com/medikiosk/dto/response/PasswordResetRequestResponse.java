package com.medikiosk.dto.response;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PasswordResetRequestResponse {
    private UUID requestId;
    private UUID doctorId;
    private String doctorName;
    private String doctorEmail;
    private String status;
    private Instant requestedAt;
    private Instant reviewedAt;
    private String rejectionReason;
    private Instant tokenExpiresAt;
    private Instant completedAt;
}
