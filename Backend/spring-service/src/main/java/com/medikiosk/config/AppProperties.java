package com.medikiosk.config;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
@Component
@ConfigurationProperties(prefix = "app")
@Validated
@Getter @Setter
public class AppProperties {
    private Jwt jwt = new Jwt();
    private Security security = new Security();
    private Cors cors = new Cors();
    private Service service = new Service();
    private AdminBootstrap adminBootstrap = new AdminBootstrap();
    @Getter @Setter public static class Jwt {
        private String secret;
        private int accessTokenExpiryMinutes = 15;
        private int refreshTokenExpiryDays = 7;
    }
    @Getter @Setter public static class Security {
        private int maxFailedLoginAttempts = 5;
        private int lockoutDurationMinutes = 15;
        private int passwordResetTokenExpiryMinutes = 30;
    }
    @Getter @Setter public static class Cors { private String allowedOrigins = "http://localhost:3000"; }
    @Getter @Setter public static class Service { private String apiKey; }
    @Getter @Setter public static class AdminBootstrap {
        private boolean enabled = true;
        private String email;
        private String fullName;
        private String password;
    }
}
