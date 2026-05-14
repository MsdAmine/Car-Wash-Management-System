package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.CreateEmployeeRequest;
import com.carwash.car_wash_api.dto.request.UpdateEmployeeRequest;
import com.carwash.car_wash_api.dto.response.EmployeeResponse;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.mapper.EmployeeMapper;
import com.carwash.car_wash_api.model.entity.Employee;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final EmployeeMapper employeeMapper;

    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        if (employeeRepository.existsByUserId(user.getId())) {
            throw new DuplicateResourceException("An employee record already exists for user ID: " + request.getUserId());
        }

        Employee employee = Employee.builder()
                .user(user)
                .position(request.getPosition())
                .hireDate(request.getHireDate())
                .build();

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse updateEmployee(UUID id, UpdateEmployeeRequest request) {
        Employee employee = findActiveEmployeeOrThrow(id);

        employee.setPosition(request.getPosition());
        employee.setHireDate(request.getHireDate());

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Transactional
    public void deactivateEmployee(UUID id) {
        Employee employee = findActiveEmployeeOrThrow(id);
        employee.setActive(false);
        employeeRepository.save(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(UUID id) {
        return employeeMapper.toResponse(findEmployeeOrThrow(id));
    }

    private Employee findEmployeeOrThrow(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
    }

    private Employee findActiveEmployeeOrThrow(UUID id) {
        Employee employee = findEmployeeOrThrow(id);
        if (!employee.isActive()) {
            throw new ResourceNotFoundException("Employee with ID " + id + " is no longer active");
        }
        return employee;
    }
}
