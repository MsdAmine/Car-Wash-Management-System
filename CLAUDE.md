# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Car Wash Management System — a full-stack monorepo. Customers book wash services and manage vehicles; admins/employees manage services, bookings, payments, and daily operations. Currently in early development (scaffolding phase).

**MVP scope:** authentication/authorization, customer and vehicle management, wash service management, booking/appointment workflow, manual payment tracking, employee operations, basic dashboards.

## Repository Layout

```
backend/car-wash-api/   Spring Boot API (Java 17)
frontend/car-wash-web/  React + Vite frontend
docs/                   Architecture and API documentation (empty)
scripts/                Utility scripts (empty)
```

## Backend — `backend/car-wash-api/`

**Stack:** Spring Boot 3.5, Java 17, Spring Security, Spring Data JPA, PostgreSQL, Lombok

**Commands (run from `backend/car-wash-api/`):**
```bash
./mvnw spring-boot:run          # Start dev server (port 8080)
./mvnw test                     # Run all tests
./mvnw test -Dtest=ClassName    # Run a single test class
./mvnw package -DskipTests      # Build JAR
./mvnw compile                  # Compile only
```

On Windows use `mvnw.cmd` instead of `./mvnw`.

**Configuration:** `src/main/resources/application.yaml` — currently only sets port 8080 and app name. Database connection properties must be added before JPA features work.

**Health check:** `GET /api/v1/health`

**Package structure:** `com.carwash.car_wash_api`

## Frontend — `frontend/car-wash-web/`

**Stack:** React 19, TypeScript 6, Vite 8, React Router 7, Axios, React Hook Form + Zod (validation), Tailwind CSS

**Commands (run from `frontend/car-wash-web/`):**
```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

## Architecture Notes

- The backend currently has no database configuration — `application.yaml` needs PostgreSQL datasource properties and JPA settings before any entity/repository work.
- Spring Security is on the classpath but not yet configured; all endpoints require a security config before the API can be called.
- The frontend `App.tsx` is a placeholder. React Router routes, Axios base URL config, and auth context have not been set up yet.
- Feature branches merge into `main` via PRs — no direct commits to main.
