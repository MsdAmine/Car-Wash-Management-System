import { useQuery } from '@tanstack/react-query'
import { fetchRevenueTimeSeries } from '../api'

export const REVENUE_KEYS = {
  all: ['revenue'] as const,
  series: (period: string, days: number, from?: string, to?: string) =>
    [...REVENUE_KEYS.all, period, days, from, to] as const,
}

export function useRevenueTimeSeries(
  period: 'daily' | 'weekly' | 'monthly',
  days: number,
  from?: string,
  to?: string,
) {
  return useQuery({
    queryKey: REVENUE_KEYS.series(period, days, from, to),
    queryFn: () => fetchRevenueTimeSeries(period, days, from, to),
  })
}
