import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelBooking } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.bookings() })
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.booking(id) })
    },
  })
}
