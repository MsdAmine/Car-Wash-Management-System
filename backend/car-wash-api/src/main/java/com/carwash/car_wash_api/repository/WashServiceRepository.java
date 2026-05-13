package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.WashService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WashServiceRepository extends JpaRepository<WashService, UUID> {

    Optional<WashService> findByName(String name);

    boolean existsByName(String name);

    List<WashService> findByActiveTrue();
}
