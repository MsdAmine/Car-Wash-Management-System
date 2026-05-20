import { useQuery } from '@tanstack/react-query'
import { fetchMyBookings } from '../api'

export const BOOKING_KEYS = {
  all: ['bookings'] as const,
  my: () => [...BOOKING_KEYS.all, 'my'] as const,
}

export function useMyBookings() {
  return useQuery({
    queryKey: BOOKING_KEYS.my(),
    queryFn: fetchMyBookings,
  })
}
