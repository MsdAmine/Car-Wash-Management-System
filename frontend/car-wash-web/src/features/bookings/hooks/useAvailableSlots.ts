import { useQuery } from '@tanstack/react-query'
import { fetchAvailableSlots } from '../api'

export const SLOT_KEYS = {
  all: ['slots'] as const,
  available: (date: string, serviceId: string) =>
    [...SLOT_KEYS.all, date, serviceId] as const,
}

export function useAvailableSlots(date: string | null, serviceId: string | null) {
  return useQuery({
    queryKey: SLOT_KEYS.available(date ?? '', serviceId ?? ''),
    queryFn: () => fetchAvailableSlots(date!, serviceId!),
    enabled: !!date && !!serviceId,
  })
}
