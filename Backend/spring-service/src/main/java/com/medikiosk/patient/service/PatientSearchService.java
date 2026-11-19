package com.medikiosk.patient.service;

import com.medikiosk.patient.dto.PatientSearchResponse;
import com.medikiosk.patient.repository.PatientRepository;
import com.medikiosk.service.*;
import com.medikiosk.enums.AuditAction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientSearchService {
    private final PatientRepository patients;
    private final AuditService audit;

    @Transactional(readOnly = true)
    public PatientSearchResponse search(UUID doctorId, String email) {
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        var result = patients.findByEmail(normalized).map(p -> PatientSearchResponse.builder()
                .patientId(p.getId()).fullName(p.getFullName()).email(p.getEmail()).build()).orElse(null);
        audit.record(doctorId, AuditAction.PATIENT_SEARCH, result == null ? null : result.getPatientId(),
                "Patient exact email search", "SUCCESS");
        return result;
    }
}
