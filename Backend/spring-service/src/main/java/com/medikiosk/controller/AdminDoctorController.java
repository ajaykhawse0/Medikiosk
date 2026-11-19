package com.medikiosk.controller;

import com.medikiosk.dto.request.*;
import com.medikiosk.dto.response.*;
import com.medikiosk.enums.AccountStatus;
import com.medikiosk.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminDoctorController {
    private final DoctorManagementService doctors;
    private final AuthService auth;

    @PostMapping("/doctors")
    public ApiResponse<DoctorDetailResponse> create(Authentication a, @Valid @RequestBody CreateDoctorRequest request) {
        return ApiResponse.ok("Doctor created", doctors.create(request, auth.currentUser(a.getName()).getId()));
    }
    @GetMapping("/doctors")
    public ApiResponse<PagedResponse<DoctorSummaryResponse>> list(
            @RequestParam(required = false) String q, @PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.ok("Doctors retrieved", PagedResponse.from(doctors.list(q, pageable)));
    }
    @GetMapping("/doctors/{id}")
    public ApiResponse<DoctorDetailResponse> get(@PathVariable UUID id) { return ApiResponse.ok("Doctor retrieved", doctors.get(id)); }
    @PutMapping("/doctors/{id}")
    public ApiResponse<DoctorDetailResponse> update(Authentication a, @PathVariable UUID id, @Valid @RequestBody UpdateDoctorRequest request) {
        return ApiResponse.ok("Doctor updated", doctors.update(id, request, auth.currentUser(a.getName()).getId()));
    }
    @PatchMapping("/doctors/{id}/status")
    public ApiResponse<DoctorDetailResponse> status(Authentication a, @PathVariable UUID id, @Valid @RequestBody DoctorStatusRequest request) {
        return ApiResponse.ok("Doctor status updated", doctors.status(id, request.getStatus(), auth.currentUser(a.getName()).getId()));
    }
}
