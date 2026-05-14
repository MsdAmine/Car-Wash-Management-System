export type EmployeePosition = 'WASHER' | 'SUPERVISOR' | 'CASHIER' | 'MANAGER' | 'RECEPTIONIST';

export interface EmployeeResponse {
    id: string;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    position: EmployeePosition;
    hireDate: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmployeeRequest {
    userId: number;
    position: EmployeePosition;
    hireDate: string;
}

export interface UpdateEmployeeRequest {
    position: EmployeePosition;
    hireDate: string;
}

export interface AssignEmployeeRequest {
    employeeId: string;
}

export interface BookingAssignmentResponse {
    id: string;
    bookingId: string;
    employeeId: string;
    employeeFirstName: string;
    employeeLastName: string;
    employeePosition: EmployeePosition;
    assignedByUserId: number;
    assignedByEmail: string;
    assignedAt: string;
    washServiceName?: string;
    appointmentDateTime?: string;
}
