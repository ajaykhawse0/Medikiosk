package com.medikiosk.enums;

public enum PasswordResetStatus {
    PENDING,
    APPROVED,
    REJECTED,
    COMPLETED,
    EXPIRED;

    public boolean isTerminal() {
        return this == REJECTED || this == COMPLETED || this == EXPIRED;
    }

    public boolean isActive() {
        return this == PENDING || this == APPROVED;
    }
}
