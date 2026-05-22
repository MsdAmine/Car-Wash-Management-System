import { useQuery } from '@tanstack/react-query'
import { fetchAdminDashboard } from '../api'

export const ADMIN_KEYS = {
  all: ['admin'] as const,
  dashboard: () => [...ADMIN_KEYS.all, 'dashboard'] as const,
  bookings: () => [...ADMIN_KEYS.all, 'bookings'] as const,
  booking: (id: string) => [...ADMIN_KEYS.all, 'booking', id] as const,
  assignments: (bookingId: string) => [...ADMIN_KEYS.all, 'assignments', bookingId] as const,
  bookingsByService: () => [...ADMIN_KEYS.all, 'bookingsByService'] as const,
  heatmap: () => [...ADMIN_KEYS.all, 'heatmap'] as const,
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_KEYS.dashboard(),
    queryFn: fetchAdminDashboard,
  })
}
