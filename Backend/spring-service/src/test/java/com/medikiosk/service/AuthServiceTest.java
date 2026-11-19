package com.medikiosk.service;

import com.medikiosk.config.AppProperties;
import com.medikiosk.dto.request.LoginRequest;
import com.medikiosk.dto.response.LoginResponse;
import com.medikiosk.entity.*;
import com.medikiosk.enums.*;
import com.medikiosk.exception.UnauthorizedException;
import com.medikiosk.repository.*;
import com.medikiosk.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository users;
    @Mock private RoleRepository roles;
    @Mock private RefreshTokenRepository refreshTokens;
    @Mock private PasswordResetRequestRepository resetRequests;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private PasswordEncoder encoder;
    @Mock private JwtService jwtService;
    @Mock private AuditService audit;

    private AppProperties properties;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        properties = new AppProperties();
        authService = new AuthService(users, roles, refreshTokens, resetRequests,
                authenticationManager, encoder, jwtService, properties, audit);
    }

    @Test
    void login_success_returnsTokens() {
        String email = "doctor@clinic.com";
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setFullName("Dr. Who");
        user.setAccountStatus(AccountStatus.ACTIVE);

        Role role = new Role();
        role.setName(RoleName.DOCTOR);
        user.getUserRoles().add(new UserRole(user, role));

        when(users.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(user)).thenReturn("jwt-token-123");

        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword("Password123!");

        LoginResponse resp = authService.login(req);

        assertNotNull(resp);
        assertEquals("jwt-token-123", resp.getAccessToken());
        assertNotNull(resp.getRefreshToken());
        verify(audit).record(eq(user.getId()), eq(AuditAction.DOCTOR_LOGIN), eq(user.getId()), anyString(), eq("SUCCESS"));
    }

    @Test
    void login_badCredentials_incrementsFailuresAndThrows() {
        String email = "doctor@clinic.com";
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setFailedLoginAttempts(0);

        when(users.findByEmail(email)).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad creds"));

        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword("WrongPassword");

        assertThrows(UnauthorizedException.class, () -> authService.login(req));
        assertEquals(1, user.getFailedLoginAttempts());
        verify(users).save(user);
    }
}
