package com.medikiosk.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
@Getter @Setter
public class ResetPasswordRequest {
    @NotBlank(message = "Reset token is required")
    private String token;
    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 128, message = "New password must be 8–128 characters")
    private String newPassword;
}
