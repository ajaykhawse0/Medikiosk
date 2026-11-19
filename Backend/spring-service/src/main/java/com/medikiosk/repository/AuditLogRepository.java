package com.medikiosk.repository;
import com.medikiosk.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    Page<AuditLog> findByActorIdOrderByTimestampDesc(UUID actorId, Pageable pageable);
    Page<AuditLog> findByTargetUserIdOrderByTimestampDesc(UUID targetUserId, Pageable pageable);
}
