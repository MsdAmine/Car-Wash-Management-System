# Car Wash Web — Frontend

React + TypeScript frontend for the Car Wash Management System.

## Stack

- **React 19** with TypeScript
- **Vite 8** — dev server and bundler
- **React Router 7** — client-side routing
- **Tailwind CSS** — utility-first styling
- **Axios** — HTTP client with auth interceptors
- **React Hook Form + Zod** — form validation (available, used selectively)

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see `backend/car-wash-api/`)

### Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local

# Edit .env.local with your values (defaults work for local dev)
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |
| `VITE_APP_NAME` | `Car Wash` | App display name in header |

### Running

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Type-check + production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Application Roles

### Customer
- Register / log in
- Add and manage vehicles
- Browse available wash services
- Book appointments
- View and cancel bookings

### Admin
- Manage wash services (create, edit, deactivate, delete)
- Manage employees (add, edit, deactivate)
- View and manage all bookings (assign staff, update status, confirm completion)
- Access dashboard with stats and summaries

### Staff (Employee)
- View daily booking schedule
- View assigned bookings
- Update booking work status

## Project Structure

```
src/
├── api/            # Axios instance with auth interceptors
├── components/     # Reusable UI components
├── config/         # App configuration (env vars)
├── context/        # React context (auth)
├── layouts/        # Role-based page layouts (Admin, Customer, Employee)
├── lib/            # Utilities (API error handling)
├── pages/          # Page components, one per route
├── routes/         # Route definitions
├── services/       # API service functions per domain
└── types/          # TypeScript interfaces and types
```

## Key Components

| Component | Purpose |
|---|---|
| `ConfirmationDialog` | Reusable confirmation modal (danger/warning/info variants) |
| `EmptyState` | Empty list state with optional CTA |
| `ErrorState` | Error state with optional retry |
| `LoadingSpinner` | Loading indicator |
| `FormInput` / `SelectInput` | Form fields with label, error, and hint support |
| `BookingSkeletons` | Skeleton loaders for booking lists/tables |
| `WashServiceSkeletons` | Skeleton loaders for service tables |

## API Error Handling

Use `getApiErrorMessage()` from `src/lib/apiError.ts` to convert Axios errors into user-friendly messages:

```ts
import { getApiErrorMessage } from '../lib/apiError';

try {
  await someService.action();
} catch (err) {
  setError(getApiErrorMessage(err, {
    404: 'Custom not-found message.',
    409: 'Custom conflict message.',
  }));
}
```

## Form Validation

Forms use inline client-side validation with field-level error messages shown on blur and on submit. The `noValidate` attribute disables browser native validation in favour of the custom messages. All required fields display an error when left empty, and format constraints (min length, value range) are checked before submission.

## Accessibility

- Skip-to-content link in all role layouts
- ARIA labels on all interactive elements
- `role="alert"` on error messages for screen reader announcements
- `aria-required`, `aria-invalid`, `aria-describedby` on form inputs
- Escape key closes all dialogs and modals
- Focus is set to the cancel button on confirmation dialog open
- Tables use `scope="col"` on column headers

## Responsive Design

- Sidebar collapses on screens narrower than `md` (768 px)
- Hamburger menu in the header opens a full-height slide-in overlay on mobile
- Tables use horizontal scroll on small screens (`overflow-x-auto`)
- Forms stack to a single column on small screens (`grid-cols-1 sm:grid-cols-2`)

## Screenshots

See [`docs/frontend-screenshots.md`](../../docs/frontend-screenshots.md) for a walkthrough of the main screens.
