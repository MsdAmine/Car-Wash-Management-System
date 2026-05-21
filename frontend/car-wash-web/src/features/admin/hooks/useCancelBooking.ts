import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminCancelBooking } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminCancelBooking(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.bookings() })
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.booking(id) })
    },
  })
}
