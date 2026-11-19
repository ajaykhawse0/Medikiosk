package com.medikiosk.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
@Getter @Setter
public class PasswordResetRejectionRequest {
    @NotBlank(message = "Rejection reason is required")
    @Size(max = 1000)
    private String reason;
}
