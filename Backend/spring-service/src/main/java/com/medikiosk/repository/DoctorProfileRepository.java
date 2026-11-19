package com.medikiosk.repository;
import com.medikiosk.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, UUID> {
    Optional<DoctorProfile> findByUserId(UUID userId);
    boolean existsByRegistrationNumber(String registrationNumber);
    boolean existsByRegistrationNumberAndUserIdNot(String registrationNumber, UUID userId);
}
