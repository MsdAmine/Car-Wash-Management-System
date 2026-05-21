import { useQuery } from '@tanstack/react-query'
import { fetchBookingsByService } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useBookingsByService(from?: string, to?: string) {
  return useQuery({
    queryKey: [...ADMIN_KEYS.bookingsByService(), from, to],
    queryFn: () => fetchBookingsByService(from, to),
  })
}
