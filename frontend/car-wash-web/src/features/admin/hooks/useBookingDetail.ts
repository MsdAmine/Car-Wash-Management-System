import { useQuery } from '@tanstack/react-query'
import { fetchBookingDetail } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ADMIN_KEYS.booking(id),
    queryFn: () => fetchBookingDetail(id),
    enabled: !!id,
  })
}
