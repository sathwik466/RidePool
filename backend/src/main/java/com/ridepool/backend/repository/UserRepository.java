package com.ridepool.backend.repository;

import com.ridepool.backend.model.Role;
import com.ridepool.backend.model.User;
import com.ridepool.backend.model.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    List<User> findByRoleAndVerificationStatus(Role role, VerificationStatus status);
}
