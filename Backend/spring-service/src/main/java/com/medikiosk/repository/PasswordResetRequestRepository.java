package com.medikiosk.repository;
import com.medikiosk.entity.PasswordResetRequest;
import com.medikiosk.enums.PasswordResetStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface PasswordResetRequestRepository extends JpaRepository<PasswordResetRequest, UUID> {
    Optional<PasswordResetRequest> findTopByDoctorIdAndStatusInOrderByRequestedAtDesc(UUID doctorId, List<PasswordResetStatus> statuses);
    Optional<PasswordResetRequest> findByResetTokenHash(String hash);
    Page<PasswordResetRequest> findByDoctorIdOrderByRequestedAtDesc(UUID doctorId, Pageable pageable);
    Page<PasswordResetRequest> findAllByOrderByRequestedAtDesc(Pageable pageable);
    long countByDoctorIdAndStatusIn(UUID doctorId, List<PasswordResetStatus> statuses);
}
