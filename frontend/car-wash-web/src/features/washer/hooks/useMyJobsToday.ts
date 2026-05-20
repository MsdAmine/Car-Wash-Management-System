import { useQuery } from '@tanstack/react-query'
import { fetchMyJobsToday } from '../api'

export const WASHER_KEYS = {
  all: ['washer'] as const,
  jobsToday: () => [...WASHER_KEYS.all, 'jobsToday'] as const,
  history: () => [...WASHER_KEYS.all, 'history'] as const,
  job: (id: string) => [...WASHER_KEYS.all, 'job', id] as const,
}

export function useMyJobsToday() {
  return useQuery({
    queryKey: WASHER_KEYS.jobsToday(),
    queryFn: fetchMyJobsToday,
  })
}
