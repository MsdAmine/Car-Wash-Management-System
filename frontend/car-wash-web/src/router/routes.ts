export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
    REGISTER: '/register',
    WASHER_PENDING: '/register/pending',
    UNAUTHORIZED: '/unauthorized',
  },
  CLIENT: {
    HOME: '/client',
    BOOK: '/client/book',
    BOOKINGS: '/client/bookings',
    BOOKING_DETAIL: (id: string) => `/client/bookings/${id}`,
    VEHICLES: '/client/vehicles',
    PROFILE: '/client/profile',
  },
  WASHER: {
    HOME: '/washer',
    JOB_DETAIL: (id: string) => `/washer/jobs/${id}`,
    HISTORY: '/washer/history',
    PROFILE: '/washer/profile',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    BOOKINGS: '/admin/bookings',
    BOOKING_DETAIL: (id: string) => `/admin/bookings/${id}`,
    SERVICES: '/admin/services',
    STAFF: '/admin/staff',
    CLIENTS: '/admin/clients',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },
} as const;
