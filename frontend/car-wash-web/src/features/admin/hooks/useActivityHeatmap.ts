import { useQuery } from '@tanstack/react-query'
import { fetchActivityHeatmap } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useActivityHeatmap(from?: string, to?: string) {
  return useQuery({
    queryKey: [...ADMIN_KEYS.heatmap(), from, to],
    queryFn: () => fetchActivityHeatmap(from, to),
  })
}
