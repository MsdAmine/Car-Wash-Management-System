import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminCreateBooking } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useAdminCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminCreateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.bookings() })
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard() })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
