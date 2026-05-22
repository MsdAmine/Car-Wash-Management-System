# Frontend Overview — Car Wash Management System

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI library |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool & dev server |
| React Router | 7 | Client-side routing |
| TanStack Query (React Query) | 5 | Server state & data fetching |
| Axios | — | HTTP client |
| Tailwind CSS | 3 | Utility-first styling |
| React Hook Form + Zod | — | Form handling & validation |
| Lucide React | — | Icon library |

---

## Architecture: Feature-Based Folder Structure

The `src/` directory is split into three top-level areas:

```
src/
├── features/     — one folder per business domain
├── shared/       — reusable code used across features
└── router/       — routing configuration and route guards
```

Each feature folder follows the same internal shape:

```
features/<domain>/
├── api.ts        — raw API call functions (Axios)
├── types.ts      — TypeScript types for this domain
├── hooks/        — React Query hooks wrapping api.ts calls
├── pages/        — full-page React components (rendered by router)
└── components/   — feature-specific sub-components (optional)
```

This separation means each domain owns its own data layer, types, and UI. Shared UI pieces (buttons, modals, tables, etc.) live in `shared/`.

---

## Entry Points

### `src/main.tsx`
The JavaScript entry point. Mounts the `<App />` component into the `index.html` root `<div>`. This is the file Vite looks for first.

### `src/App.tsx`
The root React component. It sets up three global providers that every page needs:

1. **`<QueryClientProvider>`** — makes TanStack Query available app-wide so any hook can fetch data.
2. **`<BrowserRouter>`** — enables client-side navigation.
3. **`<AuthProvider>`** — holds the logged-in user and JWT token so any component can access them.

Inside those providers, `App.tsx` declares every route using React Router's `<Routes>` and `<Route>`. All pages are loaded with `React.lazy()` (code-splitting), so the browser only downloads a page's JavaScript when the user actually navigates to it.

### `index.html`
The single HTML file the browser loads. Vite injects the JavaScript bundle here. Contains the `<div id="root">` that React renders into.

---

## Routing

### `src/router/routes.ts`
A single constant object `ROUTES` that holds every URL path string in the app, organised by role:

- `ROUTES.PUBLIC` — login, register, unauthorized, washer-pending
- `ROUTES.CLIENT` — client home, booking flow, booking list, vehicle list, profile
- `ROUTES.WASHER` — washer job list, job detail, history, profile
- `ROUTES.ADMIN` — dashboard, bookings, services, staff, clients, analytics, settings

Using a central constant instead of writing raw strings in every file means a URL change requires editing one place only.

### `src/router/ProtectedRoute.tsx`
A route wrapper component that enforces authentication and role-based access. Before rendering the actual page it checks three things:

1. If the auth system has not finished loading yet → show a spinner.
2. If the user is not logged in → redirect to `/login`.
3. If the user's role is not in the `allowedRoles` list → redirect to `/unauthorized`.

If all checks pass it renders `<Outlet />`, which is React Router's way of saying "render the child route here".

---

## Authentication

### `src/shared/context/AuthContext.tsx`
The global authentication state manager. It uses React Context so any component anywhere in the tree can call `useAuth()` to get:

- `user` — the logged-in user's id, email, name, and role (`CUSTOMER`, `EMPLOYEE`, or `ADMIN`)
- `token` — the current JWT token string
- `isAuthenticated` — boolean
- `login(authResponse)` — stores the JWT in `sessionStorage`, attaches it to Axios, then fetches the user's profile from the API to populate `user`
- `logout()` — clears the session and navigates to login

On page load, `AuthProvider` checks `sessionStorage` for a saved token. If found, it re-fetches the user's profile to restore the session (so a browser refresh does not log the user out).

### `src/shared/lib/axios.ts`
Creates the single Axios instance used by every API call in the app. It:

- Sets `baseURL` from the `VITE_API_URL` environment variable (falls back to `/api/v1`).
- Adds a **request interceptor** that attaches `Authorization: Bearer <token>` to every outgoing request.
- Adds a **response interceptor** that automatically redirects to `/login` on a `401` response and to `/unauthorized` on a `403` response.

### `src/shared/lib/queryClient.ts`
Creates and exports the TanStack Query `QueryClient` instance with default settings: data stays fresh for 5 minutes (`staleTime`), and failed requests are retried once.

---

## Features

### `features/auth/`
Handles user registration, login, and profile management.

| File | Purpose |
|---|---|
| `api.ts` | Calls `POST /auth/login`, `POST /auth/register`, `GET /users/profile`, `PUT /users/profile` |
| `types.ts` | TypeScript types: `LoginRequest`, `RegisterRequest`, `AuthResponse`, `UserProfileResponse` |
| `schemas.ts` | Zod validation schemas for the login and registration forms |
| `hooks/useLogin.ts` | React Query mutation that calls `loginUser()` then calls `auth.login()` to store the session |
| `hooks/useRegister.ts` | React Query mutation for user registration |
| `hooks/useUpdateProfile.ts` | React Query mutation for updating the user's name/email |
| `pages/LandingPage.tsx` | Public marketing page shown at `/`. Entry point for new visitors |
| `pages/LoginPage.tsx` | Login form at `/login`. On success, redirects based on the user's role |
| `pages/RegisterPage.tsx` | Registration form at `/register`. Collects name, email, password, and role |
| `pages/ClientProfilePage.tsx` | Lets a logged-in customer view and edit their profile |
| `pages/UnauthorizedPage.tsx` | Shown at `/unauthorized` when a user tries to access a page they don't have permission for |
| `pages/WasherPendingPage.tsx` | Shown after a washer registers, informing them their account is awaiting admin activation |

---

### `features/bookings/`
The core booking workflow for both customers and admins.

| File | Purpose |
|---|---|
| `api.ts` | Calls `GET /bookings/my`, `POST /bookings`, `PATCH /bookings/:id/cancel`, `GET /bookings/available-slots` |
| `types.ts` | Types: `BookingRequest`, `BookingResponse`, `AvailableSlotsResponse` |
| `hooks/useMyBookings.ts` | Fetches the current customer's booking list |
| `hooks/useCreateBooking.ts` | Mutation to submit a new booking |
| `hooks/useCancelBooking.ts` | Mutation to cancel a booking by ID |
| `hooks/useAvailableSlots.ts` | Fetches available time slots for a given date and service |
| `pages/BookingFlowPage.tsx` | Multi-step booking wizard for customers. Steps: pick service → pick date/time → confirm |
| `pages/ClientHomePage.tsx` | Customer home screen showing available services and quick booking entry |
| `pages/ClientBookingsPage.tsx` | Lists all of a customer's past and upcoming bookings |
| `pages/ClientBookingDetailPage.tsx` | Shows full details of one booking with a cancel option |
| `pages/AdminBookingsPage.tsx` | Admin view of all bookings across all customers with filtering |
| `pages/AdminBookingDetailPage.tsx` | Admin detail view for one booking — can assign a washer or cancel |
| `components/AssignJobModal.tsx` | Modal dialog used on the admin booking detail page to assign an available washer |

---

### `features/vehicles/`
Lets customers manage the vehicles they want to have washed.

| File | Purpose |
|---|---|
| `api.ts` | CRUD endpoints for vehicles |
| `types.ts` | `Vehicle`, `CreateVehicleRequest`, `UpdateVehicleRequest` types |
| `hooks/useMyVehicles.ts` | Fetches the customer's vehicle list |
| `hooks/useCreateVehicle.ts` | Mutation to add a new vehicle |
| `hooks/useUpdateVehicle.ts` | Mutation to edit a vehicle's details |
| `hooks/useDeleteVehicle.ts` | Mutation to remove a vehicle |
| `pages/ClientVehiclesPage.tsx` | Full CRUD page where customers add, edit, and delete their vehicles |

---

### `features/services/`
Admin management of the wash services offered (e.g. Basic Wash, Full Detail).

| File | Purpose |
|---|---|
| `api.ts` | Calls service CRUD and toggle-active endpoints |
| `types.ts` | `WashService`, `CreateServiceRequest`, `UpdateServiceRequest` types |
| `hooks/useAllServices.ts` | Fetches all services (including inactive) for the admin list |
| `hooks/useActiveServices.ts` | Fetches only active services (used on the booking flow) |
| `hooks/useCreateService.ts` | Mutation to create a new service |
| `hooks/useUpdateService.ts` | Mutation to edit a service's name, price, or duration |
| `hooks/useDeactivateService.ts` | Mutation to toggle a service off without deleting it |
| `pages/AdminServicesPage.tsx` | Admin CRUD table for services |

---

### `features/staff/`
Admin management of employee accounts (washers).

| File | Purpose |
|---|---|
| `api.ts` | Calls employee list and activate endpoints |
| `types.ts` | `Employee` type |
| `hooks/useAllEmployees.ts` | Fetches all employee accounts |
| `hooks/useActivateEmployee.ts` | Mutation to activate a pending washer account |
| `pages/AdminStaffPage.tsx` | Admin list page showing all staff, their status, and an activate button for pending accounts |

---

### `features/clients/`
Admin view of registered customer accounts.

| File | Purpose |
|---|---|
| `api.ts` | Calls the customer list endpoint |
| `types.ts` | `Client` type |
| `hooks/useAllClients.ts` | Fetches all registered customers |
| `pages/AdminClientsPage.tsx` | Admin read-only list of all customers |

---

### `features/admin/`
Admin-only screens that aggregate cross-domain data.

| File | Purpose |
|---|---|
| `api.ts` | Calls dashboard stats, analytics, business settings, and operating hours endpoints |
| `types.ts` | Types for dashboard stats, revenue series, activity heatmap, business settings |
| `hooks/useAdminDashboard.ts` | Fetches KPI summary cards (total bookings, revenue, etc.) |
| `hooks/useAllBookings.ts` | Fetches the full booking list for admin views |
| `hooks/useBookingDetail.ts` | Fetches one booking's full details |
| `hooks/useBookingsByService.ts` | Fetches booking counts grouped by service (for charts) |
| `hooks/useRevenueTimeSeries.ts` | Fetches daily/weekly revenue data for the analytics chart |
| `hooks/useActivityHeatmap.ts` | Fetches booking frequency by day/hour for the heatmap chart |
| `hooks/useAssignWasher.ts` | Mutation to assign a washer to a booking |
| `hooks/useAvailableEmployees.ts` | Fetches employees available for a given booking slot |
| `hooks/useCancelBooking.ts` | Admin-side mutation to cancel any booking |
| `hooks/useBusinessSettings.ts` | Fetches business name, address, and contact info |
| `hooks/useUpdateBusinessSettings.ts` | Mutation to save updated business settings |
| `hooks/useOperatingHours.ts` | Fetches the configured opening hours for each day of the week |
| `hooks/useUpdateOperatingHours.ts` | Mutation to save updated operating hours |
| `pages/AdminDashboardPage.tsx` | Main admin home — KPI cards, recent bookings list, quick-action buttons |
| `pages/AdminAnalyticsPage.tsx` | Charts page — revenue over time, bookings by service, activity heatmap |
| `pages/AdminSettingsPage.tsx` | Settings page — business info form and operating hours configuration |

---

### `features/washer/`
The washer employee interface for managing assigned jobs.

| File | Purpose |
|---|---|
| `api.ts` | Calls washer job endpoints |
| `types.ts` | `Job`, `JobStatus` types |
| `hooks/useMyJobsToday.ts` | Fetches the washer's jobs for the current day |
| `hooks/useJobDetail.ts` | Fetches full details of one assigned job |
| `hooks/useUpdateJobStatus.ts` | Mutation to mark a job as in-progress or completed |
| `hooks/useMyBookingHistory.ts` | Fetches the washer's historical completed jobs |
| `pages/WasherJobsPage.tsx` | Home screen for washers — shows today's job queue |
| `pages/WasherJobDetailPage.tsx` | Shows one job's details and lets the washer update its status |
| `pages/WasherHistoryPage.tsx` | Shows the washer's completed job history |
| `pages/WasherProfilePage.tsx` | Shows the washer's own profile information |

---

## Shared Code

### `shared/components/layout/`
Shell components that wrap pages with navigation chrome. Each layout accepts `children` (the page content) and renders the surrounding structure.

| File | Purpose |
|---|---|
| `AdminLayout.tsx` | Collapsible left sidebar with grouped nav links + a top bar header. Used by all admin pages |
| `ClientLayout.tsx` | Top navigation bar suited to the customer interface |
| `WasherLayout.tsx` | Mobile-friendly layout suited to the washer interface |
| `Sidebar.tsx` | Generic sidebar component used by `AdminLayout`. Accepts nav items, collapse state, and an optional bottom slot |
| `BottomNav.tsx` | Mobile bottom navigation bar used on the washer and client layouts |

### `shared/components/ui/`
Reusable, styled UI primitives. These are building blocks — not tied to any feature.

| File | Purpose |
|---|---|
| `Button.tsx` | Button with variants (primary, secondary, danger) and size props |
| `Input.tsx` | Styled text input field, compatible with React Hook Form |
| `Textarea.tsx` | Multi-line text input |
| `Select.tsx` | Styled dropdown/select element |
| `Checkbox.tsx` | Styled checkbox |
| `ToggleSwitch.tsx` | On/off toggle used for enabling/disabling services and operating day hours |
| `Modal.tsx` | Overlay modal with backdrop, title, and close button |
| `ConfirmDialog.tsx` | Modal pre-wired for "are you sure?" confirmation prompts |
| `Card.tsx` | White rounded container used as a visual grouping box |
| `Badge.tsx` | Small coloured label for status values (e.g. PENDING, CONFIRMED, COMPLETED) |
| `Table.tsx` | Responsive table component with header and row slot |
| `Pagination.tsx` | Page number controls for paginated lists |
| `StepTracker.tsx` | Horizontal step indicator used in the multi-step booking flow |
| `NavItem.tsx` | Single navigation link item used inside sidebars and nav bars |
| `ImagePlaceholder.tsx` | Grey box shown when an image has not loaded yet |

### `shared/components/feedback/`
Components displayed while loading or when something goes wrong.

| File | Purpose |
|---|---|
| `LoadingSpinner.tsx` | Animated spinner shown during data fetches |
| `EmptyState.tsx` | Illustrated empty message shown when a list has no items |
| `ErrorState.tsx` | Error message shown when an API call fails |

### `shared/lib/`

| File | Purpose |
|---|---|
| `axios.ts` | Configured Axios instance with auth headers and error redirect interceptors |
| `queryClient.ts` | TanStack Query client with 5-minute stale time and 1 retry |
| `formatDate.ts` | Utility functions for formatting date/time strings for display |

---

## Configuration Files (Root of `frontend/car-wash-web/`)

| File | Purpose |
|---|---|
| `vite.config.ts` | Vite build configuration. Sets up the `@/` path alias so imports like `@/shared/lib/axios` work instead of long relative paths |
| `tailwind.config.ts` | Tailwind CSS configuration — defines the content paths Tailwind scans to generate CSS |
| `postcss.config.js` | PostCSS configuration needed for Tailwind to process its `@tailwind` directives |
| `tsconfig.json` | Root TypeScript config — references `tsconfig.app.json` and `tsconfig.node.json` |
| `tsconfig.app.json` | TypeScript config for the browser-side source code (`src/`) |
| `tsconfig.node.json` | TypeScript config for Node.js config files like `vite.config.ts` |
| `eslint.config.js` | ESLint rules for code quality and style |
| `package.json` | Lists all dependencies and defines the `dev`, `build`, `lint`, `preview` scripts |
| `.env.example` | Example environment variables file. Copy to `.env` and set `VITE_API_URL` to the backend URL |
| `index.html` | The single HTML page. Vite uses this as the build entry point |

---

## Data Flow (How Everything Connects)

```
User interaction
      ↓
  Page component (features/*/pages/)
      ↓
  React Query hook (features/*/hooks/)
      ↓
  API function (features/*/api.ts)
      ↓
  Axios instance (shared/lib/axios.ts)  ←— adds JWT header
      ↓
  Spring Boot backend (port 8080)
```

On the way back:
- Axios response interceptor catches 401/403 and redirects automatically.
- React Query caches the response and re-fetches when data becomes stale.
- The page component re-renders with the new data.

---

## User Roles and Their Routes

| Role | Entry point | What they can do |
|---|---|---|
| `CUSTOMER` | `/client` | Browse services, book washes, manage vehicles, view booking history, edit profile |
| `EMPLOYEE` | `/washer` | View today's jobs, update job status, view job history |
| `ADMIN` | `/admin` | Manage services, staff, clients, bookings; view analytics; configure settings |

Role-based access is enforced on the frontend by `ProtectedRoute` and on the backend by Spring Security.
