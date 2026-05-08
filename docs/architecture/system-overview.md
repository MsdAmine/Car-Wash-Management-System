# System Architecture Documentation

## 1. High-Level Design
The system is built as a decoupled Full-Stack application using a Client-Server model.

- **Frontend:** React (TypeScript) with Vite - Handles the UI and client-side logic.
- **Backend:** Spring Boot (Java 17) - Handles business logic, security, and API endpoints.
- **Database:** PostgreSQL - Relational storage for users, vehicles, and bookings.

## 2. Backend Layered Architecture
We follow the N-tier architectural pattern to ensure separation of concerns:

1. **Controller Layer**: REST API endpoints using `ApiResponse<T>` for consistent JSON output.
2. **Service Layer**: Contains business logic and coordinates between different repositories.
3. **Repository Layer**: Uses Spring Data JPA for database abstraction.
4. **Entity Layer**: Defines the database tables using JPA/Hibernate.
5. **DTO Layer**: Data Transfer Objects to secure internal entity structures from the public API.

## 3. Communication Flow
1. **Frontend** sends an Axios request to a REST endpoint.
2. **Security Filter** checks CORS and Authentication.
3. **Controller** receives the request and calls the **Service**.
4. **Service** performs logic and interacts with the **Repository**.
5. **Repository** queries **PostgreSQL**.
6. The result is mapped to a **DTO** and returned via **ApiResponse**.