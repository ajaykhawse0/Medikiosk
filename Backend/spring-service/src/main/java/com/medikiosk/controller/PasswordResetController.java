package com.medikiosk.controller;

import com.medikiosk.dto.request.*;
import com.medikiosk.dto.response.*;
import com.medikiosk.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PasswordResetController {
    private final AuthService auth;
    private final PasswordResetService resets;

    @PostMapping("/doctor/password-reset-requests")
    public ApiResponse<PasswordResetRequestResponse> request(Authentication a) {
        return ApiResponse.ok("Password reset request submitted", resets.request(auth.currentUser(a.getName()).getId()));
    }
    @GetMapping("/doctor/password-reset-requests")
    public ApiResponse<PagedResponse<PasswordResetRequestResponse>> mine(Authentication a, @PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.ok("Password reset requests retrieved",
                PagedResponse.from(resets.list(auth.currentUser(a.getName()).getId(), pageable)));
    }
    @PostMapping("/doctor/reset-password")
    public ApiResponse<Void> complete(@Valid @RequestBody ResetPasswordRequest request) {
        resets.complete(request); return ApiResponse.ok("Password reset completed");
    }
    @GetMapping("/admin/password-reset-requests")
    public ApiResponse<PagedResponse<PasswordResetRequestResponse>> all(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.ok("Password reset requests retrieved", PagedResponse.from(resets.listAll(pageable)));
    }
    @GetMapping("/admin/password-reset-requests/{id}")
    public ApiResponse<PasswordResetRequestResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok("Password reset request retrieved", resets.get(id));
    }
    @PatchMapping("/admin/password-reset-requests/{id}/approve")
    public ApiResponse<PasswordResetRequestResponse> approve(Authentication a, @PathVariable UUID id) {
        return ApiResponse.ok("Password reset approved", resets.approve(id, auth.currentUser(a.getName()).getId()));
    }
    @PatchMapping("/admin/password-reset-requests/{id}/reject")
    public ApiResponse<PasswordResetRequestResponse> reject(Authentication a, @PathVariable UUID id,
                                                              @Valid @RequestBody PasswordResetRejectionRequest input) {
        return ApiResponse.ok("Password reset rejected", resets.reject(id, input, auth.currentUser(a.getName()).getId()));
    }
}
