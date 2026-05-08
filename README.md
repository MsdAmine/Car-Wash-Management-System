# Car Wash Management System

A full-stack web application for managing car wash operations.

The system allows customers to manage vehicles and book wash services, while admins and employees manage services, bookings, payments, and daily operations.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- PostgreSQL
- Swagger/OpenAPI

## Project Structure

```txt
car-wash-management/
│
├── backend/          Spring Boot backend application
├── frontend/         React frontend application
├── docs/             Project documentation
│   ├── architecture/
│   ├── database/
│   └── api/
├── scripts/          Utility scripts
├── README.md
└── .gitignore
```

## Development Workflow

Development work should be done on feature branches.

`git checkout -b feature/issue-name`

All changes should be merged into main through pull requests.

## MVP Scope

The first version includes:

- Authentication and authorization
- Customer and vehicle management
- Wash service management
- Booking and appointment workflow
- Manual payment tracking
- Employee operations
- Basic dashboards

Advanced features will be added after the MVP is stable.


## Quick Start

### Backend
1. Navigate to `backend/car-wash-api`.
2. Run `.\mvnw spring-boot:run`.
3. API Documentation: `http://localhost:8080/swagger-ui/index.html`.

### Frontend
1. Navigate to `frontend/car-wash-web`.
2. Run `npm install` then `npm run dev`.
3. App URL: `http://localhost:5173`.
