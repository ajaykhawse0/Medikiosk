package com.medikiosk.controller;

import com.medikiosk.dto.request.UpdateDoctorProfileRequest;
import com.medikiosk.dto.response.*;
import com.medikiosk.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doctor/profile")
@RequiredArgsConstructor
public class DoctorProfileController {
    private final AuthService auth;
    private final DoctorProfileService profiles;

    @GetMapping
    public ApiResponse<DoctorProfileResponse> get(Authentication a) {
        return ApiResponse.ok("Profile retrieved", profiles.get(auth.currentUser(a.getName()).getId()));
    }
    @PutMapping
    public ApiResponse<DoctorProfileResponse> update(Authentication a, @Valid @RequestBody UpdateDoctorProfileRequest request) {
        return ApiResponse.ok("Profile updated", profiles.update(auth.currentUser(a.getName()).getId(), request));
    }
}
