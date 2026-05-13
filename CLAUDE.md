# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **INSTRUCTION FOR CLAUDE:** At the end of every session where code is merged, update the **Implemented Features**, **API Endpoints**, and **Data Model** sections below to reflect what was added. Be specific: class names, file paths, endpoint URLs, and any non-obvious decisions made during the session.

---

## Project Overview

Car Wash Management System — a full-stack monorepo. Customers book wash services and manage vehicles; admins/employees manage services, bookings, payments, and daily operations.

**Phases:** 11 total. Phase 1 and 2 are done. Phase 3 is in progress (backend complete, frontend pending).

**GitHub project board:** tracks all phases and sub-issues.

---

## Repository Layout

```
backend/car-wash-api/   Spring Boot API (Java 17)
frontend/car-wash-web/  React + Vite SPA
docs/                   Architecture, database, and workflow docs
```

---

## Backend — `backend/car-wash-api/`

**Stack:** Spring Boot 3.5, Java 17, Spring Security + JWT, Spring Data JPA, PostgreSQL, Lombok

**Commands (run from `backend/car-wash-api/`):**
```bash
./mvnw spring-boot:run          # Start dev server (port 8080)
./mvnw test                     # Run all tests
./mvnw test -Dtest=ClassName    # Run a single test class
./mvnw package -DskipTests      # Build JAR
```
On Windows use `mvnw.cmd` instead of `./mvnw`.

**Package structure (`com.carwash.car_wash_api`):**
```
config/       SecurityConfig, ApplicationConfig, JwtAuthenticationFilter, OpenApiConfig
controller/   One controller per domain (AuthController, VehicleController, …)
dto/
  request/    Lombok @Data + @Builder classes with Bean Validation annotations
  response/   Lombok @Data + @Builder classes (ApiResponse<T>, ErrorResponse, …)
exception/    GlobalExceptionHandler (@RestControllerAdvice) + custom exception classes
mapper/       Manual @Component mappers (no MapStruct) — owner must be set in service layer
model/
  entity/     JPA entities
  enums/      Role, VehicleType, …
repository/   Spring Data JPA interfaces
service/      Business logic — one service per domain
```

**DB configuration** (`application.yaml`): reads `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` env vars with localhost defaults. JPA `ddl-auto: update` — schema is auto-managed.

**Swagger UI:** available at `http://localhost:8080/swagger-ui.html` when running.

---

## Frontend — `frontend/car-wash-web/`

**Stack:** React 19, TypeScript 6, Vite 8, React Router 7, Axios, React Hook Form + Zod, Tailwind CSS

**Commands (run from `frontend/car-wash-web/`):**
```bash
npm run dev       # Dev server (Vite)
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

**Source layout (`src/`):**
```
api/          axios.ts — configured Axios instance (base URL + auth interceptor + 401 handler)
components/   ProtectedRoute.tsx, RoleGuard.tsx, (shared UI components as they're built)
config/       index.ts — API_URL and other env-based constants
context/      AuthContext.tsx — AuthProvider + useAuth hook
pages/        One file per page (Login.tsx, Register.tsx, …)
routes/       index.tsx — React Router route definitions
services/     One service file per domain (authService.ts, …)
types/        TypeScript interfaces (auth.ts, …)
```

**Auth flow:** JWT stored in `localStorage` under key `token`. `AuthContext` re-fetches the user profile on app load. `ProtectedRoute` blocks unauthenticated access; `RoleGuard` blocks wrong-role access. After login, users are redirected by role: ADMIN → `/admin`, CUSTOMER → `/customer`, EMPLOYEE → `/employee`.

---

## Architecture Patterns

These are established patterns — follow them for all new features:

- **DTOs:** Lombok `@Data + @Builder + @NoArgsConstructor + @AllArgsConstructor`. Use Bean Validation annotations (`@NotBlank`, `@Size`, `@Pattern`, etc.) on request DTOs.
- **Mappers:** Manual Spring `@Component` classes. When converting request → entity, set relationship fields (e.g. `owner`) in the service layer, not in the mapper.
- **API responses:** Success responses return `ApiResponse<T>` (wraps data + message + timestamp). Error responses return `ErrorResponse` (status + message + path + timestamp). These two types are intentionally different.
- **Exception handling:** Throw custom exceptions (`ResourceNotFoundException`, `DuplicateResourceException`, `AccessDeniedException`) from the service layer; `GlobalExceptionHandler` catches them.
- **Security:** `User` entity implements `UserDetails`. Role authorities use the `ROLE_` prefix (`ROLE_ADMIN`, `ROLE_CUSTOMER`, `ROLE_EMPLOYEE`).
- **IDs:** `User.id` is `Long` (auto-increment); `Vehicle.id` is `UUID` (auto-generated). Follow the same pattern for new entities unless there's a reason to differ.

---

## API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/auth/register` | Public | Register new customer |
| POST | `/auth/login` | Public | Login, returns JWT |

### Users (`/api/v1/users`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/users/me` | Authenticated | Get own profile |

### Vehicles (`/api/v1/vehicles`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/vehicles` | CUSTOMER | Create vehicle |
| GET | `/vehicles` | CUSTOMER | List own vehicles |
| GET | `/vehicles/{id}` | CUSTOMER | Get own vehicle by ID |
| PUT | `/vehicles/{id}` | CUSTOMER | Update own vehicle |
| DELETE | `/vehicles/{id}` | CUSTOMER | Delete own vehicle |
| GET | `/vehicles/customer/{customerId}` | ADMIN | View customer's vehicles |

---

## Data Model

```
User:    id(Long), email(unique), password(BCrypt), firstName, lastName, phone,
         role(CUSTOMER|EMPLOYEE|ADMIN), enabled, createdAt, updatedAt

Vehicle: id(UUID), brand, model, licensePlate(unique), type(VehicleType),
         owner → User (ManyToOne, lazy), createdAt

VehicleType enum: CAR, TRUCK, MOTORCYCLE, VAN, SUV
```

---

## Implemented Features

### Phase 1 – Project Setup ✅
- Monorepo structure, Spring Boot scaffold, React/Vite scaffold
- PostgreSQL config, global exception handler, shared `ApiResponse<T>` structure
- Swagger/OpenAPI, CORS config, GitHub Actions CI, PR template

### Phase 2 – Authentication & Authorization ✅
- Backend: `User` entity + `Role` enum, `UserRepository`, BCrypt password encryption
- `AuthService` (register/login), `JwtService` (generate/validate tokens), `JwtAuthenticationFilter`
- `SecurityConfig` with role-based endpoint rules, `GlobalExceptionHandler` for auth errors
- Endpoints: `POST /auth/register`, `POST /auth/login`, `GET /users/me`
- Frontend: `authService.ts`, `AuthContext`/`useAuth`, `ProtectedRoute`, `RoleGuard`
- Pages: `Login.tsx`, `Register.tsx`; role-based redirect after login; logout clears token + hard-redirects

### Phase 3 – Customer & Vehicle Management (backend ✅ / frontend 🔲)
- Backend: `Vehicle` entity + `VehicleType` enum, `VehicleRepository`
- `VehicleRequest`/`VehicleResponse` DTOs, `VehicleMapper`, `VehicleService`, `VehicleController`
- Ownership validation (customers can only access own vehicles), input validation, admin view endpoint
- Custom exceptions: `ResourceNotFoundException`, `DuplicateResourceException`, `AccessDeniedException`
- Frontend vehicle pages: **not yet implemented** (open issues ~#152–#183)

### Phase 4 – Wash Service Management 🔲
- Not started (26 sub-issues, issues #185–#210+)
