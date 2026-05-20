import { useQuery } from '@tanstack/react-query'
import { fetchRevenueTimeSeries } from '../api'

export const REVENUE_KEYS = {
  all: ['revenue'] as const,
  series: (period: string, days: number) => [...REVENUE_KEYS.all, period, days] as const,
}

export function useRevenueTimeSeries(period: 'daily' | 'weekly' | 'monthly', days: number) {
  return useQuery({
    queryKey: REVENUE_KEYS.series(period, days),
    queryFn: () => fetchRevenueTimeSeries(period, days),
  })
}
