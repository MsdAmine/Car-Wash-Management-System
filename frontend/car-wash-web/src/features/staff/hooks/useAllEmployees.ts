import { useQuery } from '@tanstack/react-query'
import { fetchAllEmployees } from '../api'

export const STAFF_KEYS = {
  all: ['staff'] as const,
  list: () => [...STAFF_KEYS.all, 'list'] as const,
  bookings: (id: string) => [...STAFF_KEYS.all, 'bookings', id] as const,
}

export function useAllEmployees() {
  return useQuery({
    queryKey: STAFF_KEYS.list(),
    queryFn: fetchAllEmployees,
  })
}
