import { useQuery } from '@tanstack/react-query'
import { fetchAllServices } from '../api'
import { SERVICE_KEYS } from './useActiveServices'

export function useAllServices() {
  return useQuery({
    queryKey: SERVICE_KEYS.list(),
    queryFn: fetchAllServices,
  })
}
