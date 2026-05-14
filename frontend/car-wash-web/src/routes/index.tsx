/**
 * Centralized route path constants.
 * Import from here instead of using raw strings to avoid typos and ease refactoring.
 */
export const ROUTES = {
    // Public
    LOGIN: '/login',
    REGISTER: '/register',
    SERVICES: '/services',

    // Common (any authenticated user)
    HOME: '/',

    // Customer
    CUSTOMER_DASHBOARD: '/dashboard',
    MY_VEHICLES: '/my-vehicles',
    ADD_VEHICLE: '/add-vehicle',
    EDIT_VEHICLE: (id: string | number) => `/vehicles/${id}/edit`,
    BOOK_APPOINTMENT: '/book-appointment',
    MY_BOOKINGS: '/my-bookings',
    BOOKING_DETAILS: (id: string | number) => `/bookings/${id}`,

    // Admin
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_SERVICES: '/admin/services',
    ADMIN_SERVICES_ADD: '/admin/services/add',
    ADMIN_SERVICES_EDIT: (id: string | number) => `/admin/services/${id}/edit`,
    ADMIN_EMPLOYEES: '/admin/employees',
    ADMIN_EMPLOYEES_ADD: '/admin/employees/add',
    ADMIN_EMPLOYEES_EDIT: (id: string | number) => `/admin/employees/${id}/edit`,
    ADMIN_BOOKINGS: '/admin/bookings',
    ADMIN_SETTINGS: '/admin/settings',

    // Staff / Employee
    EMPLOYEE_DASHBOARD: '/employee/dashboard',
    EMPLOYEE_DAILY_BOOKINGS: '/employee/daily-bookings',
    EMPLOYEE_ASSIGNED_BOOKINGS: '/employee/assigned-bookings',
    EMPLOYEE_BOOKING_WORK: (bookingId: string | number) => `/employee/bookings/${bookingId}/work`,
    MANAGE_ORDERS: '/manage-orders',
} as const;
