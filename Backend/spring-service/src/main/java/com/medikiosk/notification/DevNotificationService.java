package com.medikiosk.notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
/**
 * DEV-ONLY notification service. Logs delivery confirmation without logging the token value.
 * Production: replace with an SMTP/SendGrid/SES implementation annotated @Primary or @Profile("prod").
 *
 * IMPORTANT: rawResetToken and temporaryPassword are NEVER logged here.
 * To retrieve the reset link in dev, use the admin approval endpoint response or check DB
 * (the hash is stored; the raw token is single-use and must be communicated out-of-band).
 */
@Service
@Profile("dev")
public class DevNotificationService implements NotificationService {
    private static final Logger log = LoggerFactory.getLogger(DevNotificationService.class);

    @Override
    public void sendPasswordResetLink(String recipientEmail, String recipientName, String rawResetToken) {
        // Token is intentionally not logged. In dev, retrieve from the approve endpoint or construct the link manually.
        log.info("[DEV-NOTIFICATION] Password reset link delivered to {} <{}>. Token NOT logged for security.",
                recipientName, recipientEmail);
        // Dev helper: print the token only if explicitly enabled via system property (never in CI)
        if (Boolean.getBoolean("medikiosk.dev.print-reset-token")) {
            System.out.println("[DEV-ONLY] Reset token for " + recipientEmail + ": " + rawResetToken);
        }
    }

    @Override
    public void sendDoctorOnboardingCredentials(String recipientEmail, String recipientName, String temporaryPassword) {
        log.info("[DEV-NOTIFICATION] Onboarding credentials delivered to {} <{}>. Password NOT logged.",
                recipientName, recipientEmail);
        if (Boolean.getBoolean("medikiosk.dev.print-reset-token")) {
            System.out.println("[DEV-ONLY] Temp password for " + recipientEmail + ": " + temporaryPassword);
        }
    }
}
