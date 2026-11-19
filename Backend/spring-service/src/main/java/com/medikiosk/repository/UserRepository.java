package com.medikiosk.repository;
import com.medikiosk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("SELECT u FROM User u JOIN u.userRoles ur JOIN ur.role r WHERE u.id = :id AND r.name = com.medikiosk.enums.RoleName.DOCTOR")
    Optional<User> findDoctorById(@Param("id") UUID id);
    @Query("SELECT u FROM User u JOIN u.userRoles ur JOIN ur.role r WHERE r.name = com.medikiosk.enums.RoleName.DOCTOR")
    Page<User> findAllDoctors(Pageable pageable);
    @Query("SELECT u FROM User u JOIN u.userRoles ur JOIN ur.role r WHERE r.name = com.medikiosk.enums.RoleName.DOCTOR AND (LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<User> searchDoctors(@Param("q") String query, Pageable pageable);
}
