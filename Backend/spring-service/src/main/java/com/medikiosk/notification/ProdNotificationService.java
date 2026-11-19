package com.medikiosk.notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
/**
 * Production notification stub — replace with real SMTP/SendGrid/SES integration.
 * Wire SMTP config via environment variables; never hardcode credentials.
 */
@Service
@Profile("!dev")
public class ProdNotificationService implements NotificationService {
    private static final Logger log = LoggerFactory.getLogger(ProdNotificationService.class);

    @Override
    public void sendPasswordResetLink(String recipientEmail, String recipientName, String rawResetToken) {
        // TODO: integrate with email provider. Build reset URL from app.frontend-url + token.
        log.warn("[PROD-NOTIFICATION] Email integration not configured. Reset link NOT delivered to {}.", recipientEmail);
        throw new UnsupportedOperationException("Email integration not yet configured for production profile.");
    }

    @Override
    public void sendDoctorOnboardingCredentials(String recipientEmail, String recipientName, String temporaryPassword) {
        log.warn("[PROD-NOTIFICATION] Email integration not configured. Credentials NOT delivered to {}.", recipientEmail);
        throw new UnsupportedOperationException("Email integration not yet configured for production profile.");
    }
}
