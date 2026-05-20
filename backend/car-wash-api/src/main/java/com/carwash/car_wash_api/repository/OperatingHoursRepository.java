package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.OperatingHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OperatingHoursRepository extends JpaRepository<OperatingHours, Long> {

    Optional<OperatingHours> findByDayOfWeek(String dayOfWeek);
}
