import { useQuery } from '@tanstack/react-query'
import { fetchAllBookings } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useAllBookings() {
  return useQuery({
    queryKey: ADMIN_KEYS.bookings(),
    queryFn: fetchAllBookings,
  })
}
