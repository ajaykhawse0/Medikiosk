package com.medikiosk.controller;

import com.medikiosk.dto.request.*;
import com.medikiosk.dto.response.*;
import com.medikiosk.service.AuthService;
import com.medikiosk.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService auth;
    private final PasswordResetService resets;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok("Login successful", auth.login(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.ok("Token refreshed", auth.refresh(request));
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        resets.requestByEmail(request.getEmail());
        return ApiResponse.ok("If the account exists, a password reset request has been submitted");
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(Authentication authentication) {
        auth.logout(authentication.getName()); return ApiResponse.ok("Logout successful");
    }

    @GetMapping("/me")
    public ApiResponse<UserMeResponse> me(Authentication authentication) {
        return ApiResponse.ok("User profile", auth.me(authentication.getName()));
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        auth.changePassword(authentication.getName(), request); return ApiResponse.ok("Password changed");
    }
}
