# Phase 2: Authentication & Authorization System

This document outlines the security architecture and implementation details for the Car Wash Management System.

## 1. Authentication Flow (JWT-Based)

The system uses a stateless JSON Web Token (JWT) architecture for secure communication between the React frontend and the Spring Boot backend.

### Login & Registration
1.  **User Submission**: User provides credentials via the `Login` or `Register` components.
2.  **Backend Verification**: The API validates credentials and returns a response containing:
    *   `token`: The JWT string.
    *   `data`: A user profile object (email, role, firstName, lastName).
3.  **Client-Side Storage**: The `authService` stores the token in `localStorage`.
4.  **Immediate State Update**: The `AuthContext` is updated with the user profile, triggering a global re-render to reflect the logged-in state.

### Axios Interceptor
To maintain security without manual overhead, an Axios request interceptor (`src/api/axios.ts`) is used:
*   It automatically retrieves the token from `localStorage` on every request.
*   If a token exists, it attaches the `Authorization: Bearer <token>` header to the outgoing HTTP request.
*   It also handles `401 Unauthorized` responses globally by clearing the session and redirecting to the login page.

---

## 2. Authorization & Security Layers

### ProtectedRoute
The `ProtectedRoute` component acts as the first layer of defense. It wraps all internal application routes.
*   **Guest Shield**: If no user session is detected, it intercepts the request and redirects the user to `/login`.
*   **Return Path**: It saves the user's intended location in the router state, allowing them to be redirected back to their target page after a successful login.

### RoleGuard (RBAC)
The `RoleGuard` provides granular Role-Based Access Control (RBAC). It is used to wrap specific route groups (e.g., Admin tools).
*   **Permission Check**: It compares the user's role (retrieved from the `AuthContext`) against a list of `allowedRoles` (e.g., `['ADMIN']` or `['CUSTOMER']`).
*   **Normalization**: It automatically handles role formatting, ensuring compatibility regardless of whether the backend returns `ADMIN` or `ROLE_ADMIN`.
*   **Smart Redirection**: If a user attempts to access a route they aren't authorized for (e.g., a Customer trying to access `/admin/settings`), the guard performs a non-blocking redirect to the Home path (`/`).
*   **Micro-Task Navigation**: Uses a deferred `navigate` call to ensure the routing engine state is synchronized before the URL change.

---

## 3. Global State Management

### AuthContext & useAuth
The `AuthContext` serves as the **Single Source of Truth** for the entire application.
*   **User State**: Stores the current user profile or `null`.
*   **Loading State**: Tracks whether the system is currently verifying a session (e.g., on page refresh).
*   **useAuth Hook**: Provides a clean interface for any component to access user data, the `login` function, or the `logout` procedure.

---

## 4. Session Lifecycle

### Token Refresh (Persistence)
The `refreshProfile` function handles session persistence when the browser is reloaded:
1.  On application mount, `AuthContext` checks `localStorage` for an existing token.
2.  If found, it calls the `/users/profile` endpoint to fetch fresh user data.
3.  The `loading` state prevents the "flicker" of the login page by showing a spinner until the profile is verified.

### Logout (The 'Hard Reset')
To ensure maximum security and prevent memory leaks, the logout procedure follows a three-step **Hard Reset**:
1.  **localStorage**: The JWT is removed.
2.  **State**: The React `user` state is set to `null`.
3.  **Memory Clear**: The application performs a `window.location.href = '/login'` redirect. This forces a full browser refresh, clearing any sensitive data from the application's memory and resetting all cached states.

---

*This concludes the Phase 2 Technical Documentation. Prepared for transition to Phase 3: Core Features.*
