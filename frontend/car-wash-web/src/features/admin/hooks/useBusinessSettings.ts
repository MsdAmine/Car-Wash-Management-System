import { useQuery } from '@tanstack/react-query'
import { fetchBusinessSettings } from '../api'

export const SETTINGS_KEYS = {
  all: ['settings'] as const,
  business: () => [...SETTINGS_KEYS.all, 'business'] as const,
  hours: () => [...SETTINGS_KEYS.all, 'hours'] as const,
}

export function useBusinessSettings() {
  return useQuery({
    queryKey: SETTINGS_KEYS.business(),
    queryFn: fetchBusinessSettings,
  })
}
