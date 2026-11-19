package com.medikiosk.service;

import com.medikiosk.config.AppProperties;
import com.medikiosk.dto.request.*;
import com.medikiosk.dto.response.PasswordResetRequestResponse;
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
public class PasswordResetService {
    private final PasswordResetRequestRepository requests;
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AppProperties properties;
    private final NotificationService notifications;
    private final RefreshTokenRepository refreshTokens;
    private final AuditService audit;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public PasswordResetRequestResponse request(UUID doctorId) {
        User doctor = users.findDoctorById(doctorId).orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        var active = requests.findTopByDoctorIdAndStatusInOrderByRequestedAtDesc(doctorId,
                List.of(PasswordResetStatus.PENDING, PasswordResetStatus.APPROVED));
        if (active.isPresent()) return response(active.get());
        PasswordResetRequest request = new PasswordResetRequest();
        request.setDoctor(doctor);
        request.setStatus(PasswordResetStatus.PENDING);
        request = requests.save(request);
        audit.record(doctorId, AuditAction.RESET_REQUEST_SUBMITTED, doctorId, "Password reset requested", "SUCCESS");
        return response(request);
    }

    @Transactional
    public void requestByEmail(String email) {
        users.findByEmail(AuthService.normalize(email))
                .filter(user -> users.findDoctorById(user.getId()).isPresent())
                .ifPresent(user -> request(user.getId()));
    }

    @Transactional(readOnly = true)
    public Page<PasswordResetRequestResponse> list(UUID doctorId, Pageable pageable) {
        return requests.findByDoctorIdOrderByRequestedAtDesc(doctorId, pageable).map(this::response);
    }

    @Transactional(readOnly = true)
    public Page<PasswordResetRequestResponse> listAll(Pageable pageable) {
        return requests.findAllByOrderByRequestedAtDesc(pageable).map(this::response);
    }

    @Transactional(readOnly = true)
    public PasswordResetRequestResponse get(UUID requestId) {
        return response(findRequest(requestId));
    }

    @Transactional
    public PasswordResetRequestResponse approve(UUID requestId, UUID adminId) {
        PasswordResetRequest request = findRequest(requestId);
        ensurePending(request);
        if (request.getDoctor().getId().equals(adminId)) throw new BusinessException("An administrator cannot approve their own request");
        String rawToken = token();
        request.setStatus(PasswordResetStatus.APPROVED);
        request.setReviewedBy(users.findById(adminId).orElseThrow(() -> new UnauthorizedException("Administrator not found")));
        request.setReviewedAt(Instant.now());
        request.setResetTokenHash(AuthService.hash(rawToken));
        request.setTokenExpiresAt(Instant.now().plusSeconds(properties.getSecurity().getPasswordResetTokenExpiryMinutes() * 60L));
        requests.save(request);
        notifications.sendPasswordResetLink(request.getDoctor().getEmail(), request.getDoctor().getFullName(), rawToken);
        audit.record(adminId, AuditAction.RESET_REQUEST_APPROVED, request.getDoctor().getId(), "Password reset approved", "SUCCESS");
        return response(request);
    }

    @Transactional
    public PasswordResetRequestResponse reject(UUID requestId, PasswordResetRejectionRequest input, UUID adminId) {
        PasswordResetRequest request = findRequest(requestId);
        ensurePending(request);
        request.setStatus(PasswordResetStatus.REJECTED); request.setReviewedBy(users.findById(adminId)
                .orElseThrow(() -> new UnauthorizedException("Administrator not found")));
        request.setReviewedAt(Instant.now()); request.setRejectionReason(input.getReason().trim());
        requests.save(request);
        audit.record(adminId, AuditAction.RESET_REQUEST_REJECTED, request.getDoctor().getId(), "Password reset rejected", "SUCCESS");
        return response(request);
    }

    @Transactional
    public void complete(ResetPasswordRequest input) {
        PasswordResetRequest request = requests.findByResetTokenHash(AuthService.hash(input.getToken()))
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired reset token"));
        if (request.getStatus() != PasswordResetStatus.APPROVED || request.isTokenExpired()) {
            if (request.getStatus() == PasswordResetStatus.APPROVED && request.isTokenExpired()) {
                request.setStatus(PasswordResetStatus.EXPIRED); requests.save(request);
            }
            throw new TokenExpiredException("Invalid or expired reset token");
        }
        User doctor = request.getDoctor();
        doctor.setPasswordHash(encoder.encode(input.getNewPassword())); doctor.setMustChangePassword(false);
        users.save(doctor);
        request.setStatus(PasswordResetStatus.COMPLETED); request.setCompletedAt(Instant.now());
        request.setResetTokenHash(null); request.setTokenExpiresAt(null); requests.save(request);
        refreshTokens.revokeAllByUserId(doctor.getId());
        audit.record(doctor.getId(), AuditAction.RESET_REQUEST_COMPLETED, doctor.getId(), "Password reset completed", "SUCCESS");
    }

    private PasswordResetRequest findRequest(UUID id) { return requests.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reset request not found")); }
    private void ensurePending(PasswordResetRequest r) { if (r.getStatus() != PasswordResetStatus.PENDING) throw new BusinessException("Reset request is not pending"); }
    private String token() { byte[] bytes = new byte[48]; random.nextBytes(bytes); return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes); }
    private PasswordResetRequestResponse response(PasswordResetRequest r) {
        return PasswordResetRequestResponse.builder().requestId(r.getId()).doctorId(r.getDoctor().getId())
                .doctorName(r.getDoctor().getFullName()).doctorEmail(r.getDoctor().getEmail()).status(r.getStatus().name())
                .requestedAt(r.getRequestedAt()).reviewedAt(r.getReviewedAt()).rejectionReason(r.getRejectionReason())
                .tokenExpiresAt(r.getTokenExpiresAt()).completedAt(r.getCompletedAt()).build();
    }
}
