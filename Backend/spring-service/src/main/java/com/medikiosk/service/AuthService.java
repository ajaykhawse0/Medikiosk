package com.medikiosk.service;

import com.medikiosk.config.AppProperties;
import com.medikiosk.dto.request.*;
import com.medikiosk.dto.response.*;
import com.medikiosk.entity.*;
import com.medikiosk.enums.*;
import com.medikiosk.exception.UnauthorizedException;
import com.medikiosk.repository.*;
import com.medikiosk.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final RoleRepository roles;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordResetRequestRepository resetRequests;
    private final AuthenticationManager authenticationManager;
    private final org.springframework.security.crypto.password.PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AppProperties properties;
    private final AuditService audit;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String email = normalize(request.getEmail());
        User user = users.findByEmail(email).orElse(null);
        if (user != null && user.isAccountLocked()) {
            throw new UnauthorizedException("Invalid credentials");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
            user = users.findByEmail(email).orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
            user.setFailedLoginAttempts(0);
            user.setAccountLockedUntil(null);
            user.setLastLoginAt(Instant.now());
            users.save(user);
            RoleName role = user.getUserRoles().stream().findFirst().map(r -> r.getRole().getName())
                    .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
            audit.record(user.getId(), role == RoleName.ADMIN ? AuditAction.ADMIN_LOGIN : AuditAction.DOCTOR_LOGIN,
                    user.getId(), "Successful login", "SUCCESS");
            return tokens(user, role);
        } catch (AuthenticationException ex) {
            if (user != null) {
                int failures = user.getFailedLoginAttempts() + 1;
                user.setFailedLoginAttempts(failures);
                if (failures >= properties.getSecurity().getMaxFailedLoginAttempts()) {
                    user.setAccountLockedUntil(Instant.now().plusSeconds(
                            properties.getSecurity().getLockoutDurationMinutes() * 60L));
                }
                users.save(user);
                audit.record(user.getId(), AuditAction.LOGIN_FAILED, user.getId(), "Failed login", "FAILURE");
            } else {
                audit.record(null, AuditAction.LOGIN_FAILED, null, "Failed login", "FAILURE");
            }
            throw new UnauthorizedException("Invalid credentials");
        }
    }

    @Transactional
    public LoginResponse refresh(RefreshTokenRequest request) {
        RefreshToken current = refreshTokens.findByTokenHash(hash(request.getRefreshToken()))
                .filter(RefreshToken::isValid)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        User user = current.getUser();
        if (!user.isEnabled() || user.getAccountStatus() != AccountStatus.ACTIVE || user.isAccountLocked()) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        current.setRevoked(true);
        refreshTokens.save(current);
        RoleName role = user.getUserRoles().stream().findFirst().map(r -> r.getRole().getName())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        LoginResponse response = tokens(user, role);
        audit.record(user.getId(), AuditAction.TOKEN_REFRESHED, user.getId(), "Refresh token rotated", "SUCCESS");
        return response;
    }

    @Transactional
    public void logout(String email) {
        User user = currentUser(email);
        refreshTokens.revokeAllByUserId(user.getId());
        audit.record(user.getId(), AuditAction.LOGOUT, user.getId(), "Logged out", "SUCCESS");
    }

    @Transactional
    public UserMeResponse me(String email) {
        User user = currentUser(email);
        return UserMeResponse.builder().userId(user.getId()).name(user.getFullName()).email(user.getEmail())
                .phoneNumber(user.getPhoneNumber()).role(user.getUserRoles().stream().findFirst()
                        .map(r -> r.getRole().getName().name()).orElse(""))
                .mustChangePassword(user.isMustChangePassword()).lastLoginAt(user.getLastLoginAt()).build();
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = currentUser(email);
        if (!encoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        user.setPasswordHash(encoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        users.save(user);
        refreshTokens.revokeAllByUserId(user.getId());
        audit.record(user.getId(), AuditAction.PASSWORD_CHANGED, user.getId(), "Password changed", "SUCCESS");
    }

    public User currentUser(String email) {
        return users.findByEmail(normalize(email)).orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
    }

    private LoginResponse tokens(User user, RoleName role) {
        String rawRefresh = randomToken();
        RefreshToken refresh = new RefreshToken();
        refresh.setUser(user);
        refresh.setTokenHash(hash(rawRefresh));
        refresh.setExpiresAt(Instant.now().plusSeconds(properties.getJwt().getRefreshTokenExpiryDays() * 86400L));
        refreshTokens.save(refresh);
        return LoginResponse.builder().userId(user.getId()).name(user.getFullName()).email(user.getEmail())
                .role(role.name()).mustChangePassword(user.isMustChangePassword())
                .accessToken(jwtService.generateAccessToken(user)).refreshToken(rawRefresh).build();
    }

    public static String normalize(String value) { return value.trim().toLowerCase(Locale.ROOT); }
    public static String hash(String value) {
        try {
            byte[] digest = java.security.MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (java.security.NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 unavailable", ex);
        }
    }
    private String randomToken() {
        byte[] bytes = new byte[48];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
