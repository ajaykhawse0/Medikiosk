package com.medikiosk.service;

import com.medikiosk.dto.request.UpdateDoctorProfileRequest;
import com.medikiosk.dto.response.DoctorProfileResponse;
import com.medikiosk.entity.*;
import com.medikiosk.enums.AuditAction;
import com.medikiosk.exception.ResourceNotFoundException;
import com.medikiosk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorProfileService {
    private final UserRepository users;
    private final DoctorProfileRepository profiles;
    private final AuditService audit;

    @Transactional(readOnly = true)
    public DoctorProfileResponse get(UUID id) {
        User user = users.findDoctorById(id).orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        DoctorProfile p = profiles.findByUserId(id).orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        return response(user, p);
    }

    @Transactional
    public DoctorProfileResponse update(UUID id, UpdateDoctorProfileRequest request) {
        User user = users.findDoctorById(id).orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        DoctorProfile p = profiles.findByUserId(id).orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        if (request.getFullName() != null && !request.getFullName().isBlank()) user.setFullName(request.getFullName().trim());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getSpecialization() != null) p.setSpecialization(request.getSpecialization());
        if (request.getDepartment() != null) p.setDepartment(request.getDepartment());
        users.save(user); profiles.save(p);
        audit.record(id, AuditAction.DOCTOR_PROFILE_UPDATED, id, "Doctor updated own profile", "SUCCESS");
        return response(user, p);
    }

    private DoctorProfileResponse response(User u, DoctorProfile p) {
        return DoctorProfileResponse.builder().userId(u.getId()).fullName(u.getFullName()).email(u.getEmail())
                .phoneNumber(u.getPhoneNumber()).registrationNumber(p.getRegistrationNumber())
                .specialization(p.getSpecialization()).department(p.getDepartment())
                .mustChangePassword(u.isMustChangePassword()).createdAt(p.getCreatedAt()).build();
    }
}
