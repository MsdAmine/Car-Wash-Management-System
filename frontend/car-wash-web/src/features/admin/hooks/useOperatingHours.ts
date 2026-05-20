import { useQuery } from '@tanstack/react-query'
import { fetchOperatingHours } from '../api'
import { SETTINGS_KEYS } from './useBusinessSettings'

export function useOperatingHours() {
  return useQuery({
    queryKey: SETTINGS_KEYS.hours(),
    queryFn: fetchOperatingHours,
  })
}
