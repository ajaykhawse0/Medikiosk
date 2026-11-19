package com.medikiosk.dto.request;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
@Getter @Setter
public class CreateDoctorRequest {
    @NotBlank(message = "Full name is required")
    @Size(max = 255)
    private String fullName;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @Size(max = 50)
    private String phoneNumber;
    @Size(max = 100)
    private String registrationNumber;
    @Size(max = 255)
    private String specialization;
    @Size(max = 255)
    private String department;
}
