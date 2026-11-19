package com.medikiosk.patient.controller;

import com.medikiosk.dto.response.ApiResponse;
import com.medikiosk.patient.dto.PatientSearchResponse;
import com.medikiosk.patient.service.PatientSearchService;
import com.medikiosk.service.AuthService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doctor/patients")
@RequiredArgsConstructor
public class PatientSearchController {
    private final AuthService auth;
    private final PatientSearchService search;

    @GetMapping("/search")
    public ApiResponse<PatientSearchResponse> search(Authentication a,
            @RequestParam @NotBlank @Email String email) {
        return ApiResponse.ok("Patient search completed", search.search(auth.currentUser(a.getName()).getId(), email));
    }
}
