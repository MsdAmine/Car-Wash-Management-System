import { useQuery } from '@tanstack/react-query'
import { fetchMyBookingHistory } from '../api'
import { WASHER_KEYS } from './useMyJobsToday'

export function useMyBookingHistory() {
  return useQuery({
    queryKey: WASHER_KEYS.history(),
    queryFn: fetchMyBookingHistory,
  })
}
