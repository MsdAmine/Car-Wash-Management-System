import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelBooking } from '../api'
import { BOOKING_KEYS } from './useMyBookings'

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.my() })
    },
  })
}
