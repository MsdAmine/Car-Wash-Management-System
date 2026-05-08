# Initial Database Schema Plan

## Core Entities

### 1. User
- **ID**: UUID / Long (Primary Key)
- **Email**: String (Unique, Indexed)
- **Role**: Enum (ADMIN, EMPLOYEE, CUSTOMER)
- **Metadata**: CreatedAt, UpdatedAt

### 2. Vehicle
- **ID**: UUID / Long (Primary Key)
- **PlateNumber**: String (Unique)
- **User_ID**: Foreign Key (References User.id)

### 3. WashService
- **Name**: String (e.g., "Full Clean")
- **Price**: Decimal
- **Duration**: Integer (Minutes)

## Relationships
- **User (1) <---> Vehicle (N)**: A customer can register multiple cars.
- **User (1) <---> Appointment (N)**: A customer or admin can manage multiple bookings.
- **Service (1) <---> Appointment (N)**: Each appointment must have a specific service type.