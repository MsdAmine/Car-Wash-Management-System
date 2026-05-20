import { useQuery } from '@tanstack/react-query'
import { fetchActiveServices } from '../api'

export const SERVICE_KEYS = {
  all: ['services'] as const,
  active: () => [...SERVICE_KEYS.all, 'active'] as const,
  list: () => [...SERVICE_KEYS.all, 'list'] as const,
}

export function useActiveServices() {
  return useQuery({
    queryKey: SERVICE_KEYS.active(),
    queryFn: fetchActiveServices,
  })
}
