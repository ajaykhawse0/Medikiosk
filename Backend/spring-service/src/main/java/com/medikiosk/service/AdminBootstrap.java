package com.medikiosk.service;

import com.medikiosk.config.AppProperties;
import com.medikiosk.entity.*;
import com.medikiosk.enums.*;
import com.medikiosk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class AdminBootstrap implements CommandLineRunner {
    private final AppProperties properties;
    private final UserRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder encoder;
    private final AuditService audit;

    @Override
    @Transactional
    public void run(String... args) {
        if (!properties.getAdminBootstrap().isEnabled()) return;
        if (users.findAll().stream().anyMatch(u -> u.getUserRoles().stream()
                .anyMatch(r -> r.getRole().getName() == RoleName.ADMIN))) return;
        var config = properties.getAdminBootstrap();
        if (config.getEmail() == null || config.getEmail().isBlank() || config.getPassword() == null
                || config.getPassword().length() < 12) {
            throw new IllegalStateException("Admin bootstrap requires ADMIN_BOOTSTRAP_EMAIL and a 12+ character ADMIN_BOOTSTRAP_PASSWORD");
        }
        User admin = new User();
        admin.setFullName(config.getFullName());
        admin.setEmail(AuthService.normalize(config.getEmail()));
        admin.setPasswordHash(encoder.encode(config.getPassword()));
        admin.setMustChangePassword(false);
        admin.setAccountStatus(AccountStatus.ACTIVE);
        admin = users.save(admin);
        Role role = roles.findByName(RoleName.ADMIN).orElseThrow(() -> new IllegalStateException("ADMIN role missing"));
        admin.getUserRoles().add(new UserRole(admin, role)); users.save(admin);
        audit.record(null, AuditAction.ADMIN_BOOTSTRAP_CREATED, admin.getId(), "Initial administrator created", "SUCCESS");
    }
}
