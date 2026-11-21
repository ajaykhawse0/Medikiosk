package com.medikiosk.service;

import com.medikiosk.dto.request.*;
import com.medikiosk.dto.response.*;
import com.medikiosk.entity.*;
import com.medikiosk.enums.*;
import com.medikiosk.exception.*;
import com.medikiosk.notification.NotificationService;
import com.medikiosk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DoctorManagementService {
    private final UserRepository users;
    private final RoleRepository roles;
    private final DoctorProfileRepository profiles;
    private final PasswordEncoder encoder;
    private final NotificationService notifications;
    private final AuditService audit;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public DoctorDetailResponse create(CreateDoctorRequest request, UUID actorId) {
        String email = AuthService.normalize(request.getEmail());
        if (users.existsByEmail(email)) throw new DuplicateResourceException("Email is already registered");
        if (request.getRegistrationNumber() != null && !request.getRegistrationNumber().isBlank()
                && profiles.existsByRegistrationNumber(request.getRegistrationNumber().trim()))
            throw new DuplicateResourceException("Registration number is already registered");
        String temporaryPassword = temporaryPassword();
        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPasswordHash(encoder.encode(temporaryPassword));
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setMustChangePassword(true);
        Instant now = Instant.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        user = users.saveAndFlush(user);
        Role role = roles.findByName(RoleName.DOCTOR).orElseThrow(() -> new IllegalStateException("DOCTOR role missing"));
        user.getUserRoles().add(new UserRole(user, role));
        user = users.saveAndFlush(user);
        DoctorProfile profile = new DoctorProfile();
        profile.setUser(user);
        profile.setRegistrationNumber(blankToNull(request.getRegistrationNumber()));
        profile.setSpecialization(request.getSpecialization());
        profile.setDepartment(request.getDepartment());
        profile.setCreatedAt(now);
        profile.setUpdatedAt(now);
        profiles.saveAndFlush(profile);
        notifications.sendDoctorOnboardingCredentials(email, user.getFullName(), temporaryPassword);
        audit.record(actorId, AuditAction.DOCTOR_CREATED, user.getId(), "Doctor created", "SUCCESS");
        DoctorDetailResponse response = detail(user, profile);
        response.setTemporaryPassword(temporaryPassword);
        return response;
    }

    @Transactional(readOnly = true)
    public Page<DoctorSummaryResponse> list(String query, Pageable pageable) {
        Page<User> page = query == null || query.isBlank() ? users.findAllDoctors(pageable)
                : users.searchDoctors(query.trim(), pageable);
        return page.map(user -> {
            DoctorProfile p = profiles.findByUserId(user.getId()).orElse(null);
            return DoctorSummaryResponse.builder().doctorId(user.getId()).fullName(user.getFullName())
                    .email(user.getEmail()).accountStatus(user.getAccountStatus().name())
                    .specialization(p == null ? null : p.getSpecialization())
                    .department(p == null ? null : p.getDepartment()).createdAt(user.getCreatedAt()).build();
        });
    }

    @Transactional
    public DoctorDetailResponse update(UUID doctorId, UpdateDoctorRequest request, UUID actorId) {
        User user = doctor(doctorId);
        DoctorProfile profile = profiles.findByUserId(doctorId).orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        if (request.getRegistrationNumber() != null && !request.getRegistrationNumber().isBlank()
                && profiles.existsByRegistrationNumberAndUserIdNot(request.getRegistrationNumber().trim(), doctorId))
            throw new DuplicateResourceException("Registration number is already registered");
        user.setFullName(request.getFullName().trim()); user.setPhoneNumber(request.getPhoneNumber());
        profile.setRegistrationNumber(blankToNull(request.getRegistrationNumber()));
        profile.setSpecialization(request.getSpecialization()); profile.setDepartment(request.getDepartment());
        users.save(user); profiles.save(profile);
        audit.record(actorId, AuditAction.DOCTOR_UPDATED, doctorId, "Doctor updated", "SUCCESS");
        return detail(user, profile);
    }

    @Transactional
    public DoctorDetailResponse status(UUID doctorId, AccountStatus status, UUID actorId) {
        if (status == AccountStatus.PENDING_ACTIVATION) throw new BusinessException("Invalid doctor status");
        User user = doctor(doctorId);
        user.setAccountStatus(status); user.setEnabled(status == AccountStatus.ACTIVE); users.save(user);
        audit.record(actorId, status == AccountStatus.ACTIVE ? AuditAction.DOCTOR_ACTIVATED : AuditAction.DOCTOR_DEACTIVATED,
                doctorId, "Doctor status changed", "SUCCESS");
        return detail(user, profiles.findByUserId(doctorId).orElse(null));
    }

    @Transactional(readOnly = true)
    public DoctorDetailResponse get(UUID id) {
        User user = doctor(id);
        return detail(user, profiles.findByUserId(id).orElse(null));
    }

    private User doctor(UUID id) { return users.findDoctorById(id).orElseThrow(() -> new ResourceNotFoundException("Doctor not found")); }
    private DoctorDetailResponse detail(User u, DoctorProfile p) {
        return DoctorDetailResponse.builder().doctorId(u.getId()).fullName(u.getFullName()).email(u.getEmail())
                .phoneNumber(u.getPhoneNumber()).accountStatus(u.getAccountStatus().name()).enabled(u.isEnabled())
                .mustChangePassword(u.isMustChangePassword()).registrationNumber(p == null ? null : p.getRegistrationNumber())
                .specialization(p == null ? null : p.getSpecialization()).department(p == null ? null : p.getDepartment())
                .createdAt(u.getCreatedAt()).updatedAt(u.getUpdatedAt()).lastLoginAt(u.getLastLoginAt()).build();
    }
    private String temporaryPassword() {
        byte[] bytes = new byte[18]; random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
    private static String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
