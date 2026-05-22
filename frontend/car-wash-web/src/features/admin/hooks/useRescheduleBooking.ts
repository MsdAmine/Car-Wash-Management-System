import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rescheduleBooking } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useRescheduleBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, appointmentDateTime }: { id: string; appointmentDateTime: string }) =>
      rescheduleBooking(id, { appointmentDateTime }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.bookings() })
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.booking(id) })
    },
  })
}
