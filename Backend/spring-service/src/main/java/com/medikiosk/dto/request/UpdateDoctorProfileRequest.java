package com.medikiosk.dto.request;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
@Getter @Setter
public class UpdateDoctorProfileRequest {
    @Size(max = 255)
    private String fullName;
    @Size(max = 50)
    private String phoneNumber;
    @Size(max = 255)
    private String specialization;
    @Size(max = 255)
    private String department;
}
