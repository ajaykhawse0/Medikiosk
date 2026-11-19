package com.medikiosk.notification;
/**
 * Abstraction for out-of-band notifications (password reset links, onboarding credentials).
 * Production implementation: wire to an SMTP/email provider.
 * Dev implementation: logs a sanitized message — NEVER the raw token.
 */
public interface NotificationService {
    void sendPasswordResetLink(String recipientEmail, String recipientName, String rawResetToken);
    void sendDoctorOnboardingCredentials(String recipientEmail, String recipientName, String temporaryPassword);
}
