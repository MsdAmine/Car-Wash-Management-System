package com.carwash.car_wash_api.mapper;

import com.carwash.car_wash_api.dto.response.EmployeeResponse;
import com.carwash.car_wash_api.model.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeResponse toResponse(Employee employee) {
        if (employee == null)
            return null;

        return EmployeeResponse.builder()
                .id(employee.getId())
                .userId(employee.getUser() != null ? employee.getUser().getId() : null)
                .email(employee.getUser() != null ? employee.getUser().getEmail() : null)
                .firstName(employee.getUser() != null ? employee.getUser().getFirstName() : null)
                .lastName(employee.getUser() != null ? employee.getUser().getLastName() : null)
                .phone(employee.getUser() != null ? employee.getUser().getPhone() : null)
                .position(employee.getPosition())
                .hireDate(employee.getHireDate())
                .active(employee.isActive())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}
