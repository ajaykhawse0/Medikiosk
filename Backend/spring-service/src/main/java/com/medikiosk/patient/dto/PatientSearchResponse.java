package com.medikiosk.patient.dto;
import lombok.*;
import java.util.UUID;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientSearchResponse {
    private UUID patientId;
    private String fullName;
    private String email;
    // phoneNumber intentionally excluded from search results
}
