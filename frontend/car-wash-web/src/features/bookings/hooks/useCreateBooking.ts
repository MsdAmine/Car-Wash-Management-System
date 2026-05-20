import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBooking } from '../api'
import { BOOKING_KEYS } from './useMyBookings'

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.my() })
    },
  })
}
