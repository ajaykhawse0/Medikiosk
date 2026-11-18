package com.medikiosk.enums;

public enum AuditAction {

    // Auth events
    ADMIN_LOGIN,
    DOCTOR_LOGIN,
    LOGIN_FAILED,
    LOGOUT,
    TOKEN_REFRESHED,

    // Password events
    PASSWORD_CHANGED,
    MUST_CHANGE_PASSWORD_CLEARED,

    // Admin bootstrap
    ADMIN_BOOTSTRAP_SKIPPED,
    ADMIN_BOOTSTRAP_CREATED,

    // Doctor management (ADMIN actions)
    DOCTOR_CREATED,
    DOCTOR_UPDATED,
    DOCTOR_ACTIVATED,
    DOCTOR_DEACTIVATED,
    DOCTOR_VIEWED,

    // Password reset flow
    RESET_REQUEST_SUBMITTED,
    RESET_REQUEST_APPROVED,
    RESET_REQUEST_REJECTED,
    RESET_REQUEST_COMPLETED,
    RESET_REQUEST_EXPIRED,

    // Doctor profile (self-service)
    DOCTOR_PROFILE_VIEWED,
    DOCTOR_PROFILE_UPDATED,

    // Patient search (always audited, rate-limited)
    PATIENT_SEARCH,
    PATIENT_SEARCH_DENIED,

    // Encounter access (future modules hook into AuditService)
    ENCOUNTER_ACCESSED,
    ENCOUNTER_ACCESS_DENIED
}
