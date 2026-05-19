# AI_RULES.md — WashFlow Frontend

This file is the source of truth for every AI-assisted session on this codebase.
Read it fully before generating any code. Do not deviate from these rules without
explicit instruction.

---

## 1. Project overview

A car wash management platform with three user roles:

- **Client** — books wash services, manages vehicles, tracks bookings
- **Car Washer** — views assigned jobs, updates job status
- **Admin** — manages bookings, staff, services, and operations

**Backend:** Spring Boot REST API + PostgreSQL (already functional)
**Frontend:** React + Vite + TypeScript

---

## 2. Stack

| Layer              | Choice                                       |
| ------------------ | -------------------------------------------- |
| Framework          | React 18 + Vite                              |
| Language           | TypeScript (strict mode)                     |
| Routing            | React Router v6                              |
| Styling            | Tailwind CSS (utility-first, no CSS modules) |
| Server state       | TanStack React Query v5                      |
| Auth/session state | React Context                                |
| UI state           | Local `useState` / `useReducer`              |
| HTTP client        | Axios (single configured instance)           |
| Form handling      | React Hook Form + Zod                        |
| Icons              | Lucide React                                 |

**Do not introduce new libraries** without flagging it first. If a task seems to
require a new dependency, ask before adding it.

---

## 3. Folder structure

```
src/
├── features/                  # One folder per domain feature
│   ├── auth/
│   │   ├── components/        # Feature-specific components
│   │   ├── hooks/             # useLogin, useRegister, etc.
│   │   ├── pages/             # LoginPage, RegisterPage, etc.
│   │   ├── api.ts             # All API calls for this feature
│   │   ├── schemas.ts         # Zod schemas for forms
│   │   └── types.ts           # Feature-specific TypeScript types
│   ├── bookings/
│   ├── vehicles/
│   ├── services/              # Car wash service management
│   ├── staff/
│   ├── clients/               # Admin view of clients
│   ├── washer/                # Car washer role screens
│   └── admin/                 # Admin-only screens (dashboard, analytics)
│
├── shared/
│   ├── components/
│   │   ├── ui/                # Primitives: Button, Input, Badge, Card, etc.
│   │   ├── layout/            # AppShell, Sidebar, TopNav, PageWrapper
│   │   └── feedback/          # LoadingSpinner, ErrorState, EmptyState
│   ├── hooks/                 # useDebounce, usePagination, etc.
│   ├── lib/
│   │   ├── axios.ts           # Configured Axios instance (single export)
│   │   └── queryClient.ts     # React Query client config
│   ├── types/                 # Global types, API response shapes
│   └── context/
│       └── AuthContext.tsx    # Auth state + session management
│
└── router/
    ├── index.tsx              # Route tree
    ├── ProtectedRoute.tsx     # Auth guard component
    └── routes.ts              # Route path constants (no magic strings)
```

**Rules:**

- Features do not import from other features directly. Shared logic goes in `shared/`.
- Pages are thin — they import layout + feature components, nothing else.
- `api.ts` files contain only Axios calls. No business logic inside them.
- Never put API calls directly inside components.

---

## 4. Naming conventions

| Thing             | Convention                         | Example                  |
| ----------------- | ---------------------------------- | ------------------------ |
| Components        | PascalCase                         | `BookingCard.tsx`        |
| Hooks             | camelCase, `use` prefix            | `useBookings.ts`         |
| Pages             | PascalCase, `Page` suffix          | `BookingsPage.tsx`       |
| API files         | camelCase                          | `api.ts` per feature     |
| Types/interfaces  | PascalCase                         | `Booking`, `CarWasher`   |
| Zod schemas       | camelCase, `Schema` suffix         | `loginSchema`            |
| Route constants   | SCREAMING_SNAKE_CASE               | `ROUTES.CLIENT.BOOKINGS` |
| Tailwind variants | Kept inline, no custom class names |                          |
| Context files     | PascalCase, `Context` suffix       | `AuthContext.tsx`        |

**File naming:** one component per file. The file name matches the component name.

---

## 5. TypeScript rules

- **Strict mode is on.** No `any`. No `as unknown as X` hacks.
- All API response shapes must be typed. Define them in `feature/types.ts`.
- Use `interface` for object shapes, `type` for unions and computed types.
- Props interfaces are defined in the same file as the component.
- Never use `React.FC<Props>` — use explicit return type `JSX.Element` or none.
- Enums are forbidden — use `as const` objects instead.

```ts
// ✅ correct
const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

// ❌ wrong
enum BookingStatus {
  PENDING,
  CONFIRMED,
}
```

---

## 6. State management rules

### Server state — React Query

- Every API call is wrapped in a custom hook inside `feature/hooks/`.
- Query keys are defined as constants at the top of each hook file.
- Always handle `isLoading`, `isError`, and empty states in the UI.
- Mutations call `queryClient.invalidateQueries` on success.
- Never store server data in `useState`. React Query owns it.

```ts
// ✅ correct
export const BOOKING_KEYS = {
  all: ["bookings"] as const,
  list: () => [...BOOKING_KEYS.all, "list"] as const,
  detail: (id: string) => [...BOOKING_KEYS.all, id] as const,
};

export function useBookings() {
  return useQuery({ queryKey: BOOKING_KEYS.list(), queryFn: fetchBookings });
}
```

### Auth/session state — React Context

- `AuthContext` holds: `user`, `token`, `isAuthenticated`, `login()`, `logout()`.
- Auth context is the only context in this app (until further notice).
- Role-based rendering uses `user.role` from auth context.
- Protected routes check `isAuthenticated` via `ProtectedRoute` wrapper.

### UI state — local React state

- Modals open/closed: `useState`
- Form steps: `useState`
- Toggled UI panels: `useState`
- If state needs to be shared across more than 2 sibling components, lift it up.
- Do not reach for Context or React Query for UI-only state.

---

## 7. Styling rules (Tailwind)

- **Utility-first.** No custom CSS files unless unavoidable.
- No inline `style={{}}` except for truly dynamic values (e.g. calculated widths).
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) — mobile-first.
- Color palette: **Indigo** is the primary brand color (`indigo-600`, `indigo-700`).
- Semantic colors: green = success, red = error/danger, amber = warning, blue = info.
- Spacing scale: stick to Tailwind's default scale (4, 6, 8, 10, 12, 16...).
- All interactive elements must have a `hover:` and `focus-visible:` state.
- Use `gap-` for flex/grid spacing, not `margin` between siblings.

```tsx
// ✅ correct
<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500">
  Book now
</button>

// ❌ wrong
<button style={{ backgroundColor: '#4338CA', padding: '8px 16px' }}>
  Book now
</button>
```

---

## 8. Component rules

- Every component receives **typed props**. No prop drilling beyond 2 levels — abstract into a sub-component or pass via context.
- All list-rendering uses `.map()` with a stable `key` (never index as key for mutable lists).
- Loading, error, and empty states are **required** for every data-fetching component.
- Avoid prop spreading (`{...props}`) on DOM elements — it leaks unknown attributes.
- Components are kept small. If a component exceeds ~150 lines, split it.

```tsx
// Required pattern for data components
if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorState message="Could not load bookings." />;
if (!bookings.length) return <EmptyState message="No bookings yet." />;
```

---

## 9. API and data fetching

- The Axios instance lives at `shared/lib/axios.ts`. Import only from there.
- Base URL comes from `import.meta.env.VITE_API_URL`. Never hardcode URLs.
- Auth token is injected via a request interceptor in the Axios instance.
- API functions return typed promises. Example:

```ts
// features/bookings/api.ts
import api from "@/shared/lib/axios";
import type { Booking } from "./types";

export async function fetchBookings(): Promise<Booking[]> {
  const { data } = await api.get("/bookings");
  return data;
}
```

- Error handling: the Axios instance has a response interceptor that handles
  401 (redirect to login) and 403 (redirect to unauthorized page) globally.
  Component-level errors handle everything else.

---

## 10. Routing

- All route paths are defined as constants in `router/routes.ts`. Never write
  path strings inline.
- Route guards live in `ProtectedRoute.tsx`. It checks `isAuthenticated` and
  `user.role`.
- Each role has its own layout — `ClientLayout`, `WasherLayout`, `AdminLayout`.
- Lazy-load all page components with `React.lazy()` and `Suspense`.

```ts
// router/routes.ts
export const ROUTES = {
  PUBLIC: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  CLIENT: {
    HOME: "/client",
    BOOK: "/client/book",
    BOOKINGS: "/client/bookings",
    BOOKING_DETAIL: (id: string) => `/client/bookings/${id}`,
    VEHICLES: "/client/vehicles",
  },
  WASHER: {
    HOME: "/washer",
    JOB_DETAIL: (id: string) => `/washer/jobs/${id}`,
    HISTORY: "/washer/history",
  },
  ADMIN: {
    DASHBOARD: "/admin",
    BOOKINGS: "/admin/bookings",
    BOOKING_DETAIL: (id: string) => `/admin/bookings/${id}`,
    SERVICES: "/admin/services",
    STAFF: "/admin/staff",
    CLIENTS: "/admin/clients",
    ANALYTICS: "/admin/analytics",
  },
} as const;
```

---

## 11. Forms

- All forms use **React Hook Form** with a **Zod** schema for validation.
- Schema is defined in `feature/schemas.ts`, not inline in the component.
- `register`, `handleSubmit`, `formState.errors` are the only RHF APIs used by default.
- Error messages come from the Zod schema — no hardcoded strings in components.
- Submit buttons are disabled while `isSubmitting` is true.

---

## 12. Accessibility

- Every `<img>` has `alt`.
- Every icon-only button has `aria-label`.
- Form inputs are associated with labels via `htmlFor` / `id`.
- Focus is managed after modal open/close.
- Color is never the only differentiator of state (always pair with text or icon).
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<button>` (not `<div onClick>`).

---

## 13. What not to do

- Do not use `useEffect` to sync server data — that's React Query's job.
- Do not store JWT tokens in `localStorage` — use httpOnly cookies or memory.
- Do not import from `features/X` inside `features/Y`.
- Do not create a new context for every piece of shared state.
- Do not write inline Axios calls inside components.
- Do not use default exports for hooks or utility functions.
- Do not skip loading/error/empty states to save time.
- Do not add a library when a 10-line utility function solves the problem.

---

## 14. Assets & media

- **Never generate, source, or embed real images.** This project is in active
  development — real assets will be added later.
- For every place an image would appear (hero banners, avatars, car photos,
  service thumbnails, etc.), render a styled placeholder `<div>` instead.
- Placeholders must include a short label describing what the image should be.
- Use a consistent placeholder style across all components:

```tsx
// shared/components/ui/ImagePlaceholder.tsx
interface ImagePlaceholderProps {
  label: string;
  className?: string;
}

export function ImagePlaceholder({ label, className }: ImagePlaceholderProps) {
  return (
    <div
      className={`bg-gray-100 flex items-center justify-center
      text-gray-400 text-xs text-center rounded-lg p-2 ${className}`}
    >
      {label}
    </div>
  );
}
```

- Usage examples:
  - Service card thumbnail → `<ImagePlaceholder label="Service photo — exterior wash" className="w-full h-32" />`
  - User avatar → `<ImagePlaceholder label="User avatar" className="w-10 h-10 rounded-full" />`
  - Landing page hero → `<ImagePlaceholder label="Hero — car being washed" className="w-full h-96" />`
- When real images are eventually provided, only the `ImagePlaceholder`
  component needs to be swapped — no hunting across files.

---

## 15. Washer screens — layout constraint

- Washer screens are mobile-first (375px base).
- On screens wider than `sm`, center the layout with `max-w-sm mx-auto`.
- Do NOT show a "switch to mobile" message or block desktop access.
- The layout handles all viewports naturally.
