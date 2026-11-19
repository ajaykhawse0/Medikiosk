package com.medikiosk.service;

import com.medikiosk.entity.AuditLog;
import com.medikiosk.enums.AuditAction;
import com.medikiosk.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuditLogRepository repository;

    @Transactional
    public void record(UUID actorId, AuditAction action, UUID targetId, String description, String outcome) {
        repository.saveAndFlush(AuditLog.builder().actorId(actorId).action(action).targetUserId(targetId)
                .description(description).outcome(outcome).timestamp(java.time.Instant.now()).build());
    }
}
