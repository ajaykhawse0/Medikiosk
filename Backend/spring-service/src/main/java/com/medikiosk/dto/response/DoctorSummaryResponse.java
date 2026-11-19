package com.medikiosk.dto.response;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DoctorSummaryResponse {
    private UUID doctorId;
    private String fullName;
    private String email;
    private String accountStatus;
    private String specialization;
    private String department;
    private Instant createdAt;
}
