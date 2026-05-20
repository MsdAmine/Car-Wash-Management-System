import { useQuery } from '@tanstack/react-query'
import { fetchActivityHeatmap } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

export function useActivityHeatmap() {
  return useQuery({
    queryKey: ADMIN_KEYS.heatmap(),
    queryFn: fetchActivityHeatmap,
  })
}
