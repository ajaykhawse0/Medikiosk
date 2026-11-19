package com.medikiosk.dto.request;
import com.medikiosk.enums.AccountStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
@Getter @Setter
public class DoctorStatusRequest {
    @NotNull(message = "Status is required")
    private AccountStatus status;
}
