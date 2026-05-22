package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPasswordResetToken(String passwordResetToken);

    Boolean existsByEmail(String email);

    List<User> findAllByRole(Role role);
}
