import { useQuery } from '@tanstack/react-query'
import { fetchBookingsByService } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useBookingsByService() {
  return useQuery({
    queryKey: ADMIN_KEYS.bookingsByService(),
    queryFn: fetchBookingsByService,
  })
}
