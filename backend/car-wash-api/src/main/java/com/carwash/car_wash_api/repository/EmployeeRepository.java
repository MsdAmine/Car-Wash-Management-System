package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.Employee;
import com.carwash.car_wash_api.model.enums.EmployeePosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    boolean existsByUserId(Long userId);

    Optional<Employee> findByUserId(Long userId);

    List<Employee> findByActive(boolean active);

    List<Employee> findByPosition(EmployeePosition position);
}
