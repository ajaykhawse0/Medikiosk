package com.medikiosk.service;

import com.medikiosk.config.AppProperties;
import com.medikiosk.dto.response.PasswordResetRequestResponse;
import com.medikiosk.entity.*;
import com.medikiosk.enums.*;
import com.medikiosk.exception.BusinessException;
import com.medikiosk.notification.NotificationService;
import com.medikiosk.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock private PasswordResetRequestRepository requests;
    @Mock private UserRepository users;
    @Mock private PasswordEncoder encoder;
    @Mock private NotificationService notifications;
    @Mock private RefreshTokenRepository refreshTokens;
    @Mock private AuditService audit;

    private AppProperties properties;
    private PasswordResetService service;

    @BeforeEach
    void setUp() {
        properties = new AppProperties();
        service = new PasswordResetService(requests, users, encoder, properties, notifications, refreshTokens, audit);
    }

    @Test
    void requestReset_createsPendingRequest() {
        UUID doctorId = UUID.randomUUID();
        User doctor = new User();
        doctor.setId(doctorId);
        doctor.setEmail("doc@clinic.com");
        doctor.setFullName("Dr. Doc");

        when(users.findDoctorById(doctorId)).thenReturn(Optional.of(doctor));
        when(requests.findTopByDoctorIdAndStatusInOrderByRequestedAtDesc(eq(doctorId), any())).thenReturn(Optional.empty());
        when(requests.save(any(PasswordResetRequest.class))).thenAnswer(inv -> {
            PasswordResetRequest r = inv.getArgument(0);
            r.setId(UUID.randomUUID());
            return r;
        });

        PasswordResetRequestResponse resp = service.request(doctorId);

        assertNotNull(resp);
        assertEquals(PasswordResetStatus.PENDING.name(), resp.getStatus());
        verify(requests).save(any(PasswordResetRequest.class));
    }

    @Test
    void approve_adminCannotApproveOwnRequest_throws() {
        UUID adminId = UUID.randomUUID();
        PasswordResetRequest req = new PasswordResetRequest();
        req.setId(UUID.randomUUID());
        req.setStatus(PasswordResetStatus.PENDING);

        User doctor = new User();
        doctor.setId(adminId); // same as adminId
        req.setDoctor(doctor);

        when(requests.findById(req.getId())).thenReturn(Optional.of(req));

        assertThrows(BusinessException.class, () -> service.approve(req.getId(), adminId));
    }
}
