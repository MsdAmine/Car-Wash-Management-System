import { useQuery } from '@tanstack/react-query'
import { fetchAvailableEmployees } from '../api'

export function useAvailableEmployees(
  date: string,
  time: string,
  duration: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['employees', 'available', date, time, duration],
    queryFn: () => fetchAvailableEmployees(date, time, duration),
    enabled: enabled && !!date && !!time && duration > 0,
  })
}
