import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rescheduleMyBooking } from '../api'
import { BOOKING_KEYS } from './useMyBookings'

export function useRescheduleBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, appointmentDateTime }: { id: string; appointmentDateTime: string }) =>
      rescheduleMyBooking(id, appointmentDateTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.my() })
    },
  })
}
