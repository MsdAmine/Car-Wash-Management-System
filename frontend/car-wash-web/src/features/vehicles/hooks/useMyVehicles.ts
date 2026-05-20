import { useQuery } from '@tanstack/react-query'
import { fetchMyVehicles } from '../api'

export const VEHICLE_KEYS = {
  all: ['vehicles'] as const,
  my: () => [...VEHICLE_KEYS.all, 'my'] as const,
}

export function useMyVehicles() {
  return useQuery({
    queryKey: VEHICLE_KEYS.my(),
    queryFn: fetchMyVehicles,
  })
}
