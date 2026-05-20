import { useQuery } from '@tanstack/react-query'
import { fetchAllCustomers } from '../api'

export const CLIENT_KEYS = {
  all: ['clients'] as const,
  list: () => [...CLIENT_KEYS.all, 'list'] as const,
}

export function useAllClients() {
  return useQuery({
    queryKey: CLIENT_KEYS.list(),
    queryFn: fetchAllCustomers,
  })
}
