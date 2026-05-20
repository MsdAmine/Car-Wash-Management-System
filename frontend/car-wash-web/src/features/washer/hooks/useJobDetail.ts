import { useQuery } from '@tanstack/react-query'
import { fetchBookingById } from '../api'
import { WASHER_KEYS } from './useMyJobsToday'

export function useJobDetail(id: string) {
  return useQuery({
    queryKey: WASHER_KEYS.job(id),
    queryFn: () => fetchBookingById(id),
    enabled: !!id,
  })
}
