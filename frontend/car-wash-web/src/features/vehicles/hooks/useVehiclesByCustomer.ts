import { useQuery } from '@tanstack/react-query'
import { fetchVehiclesByCustomer } from '../api'

export function useVehiclesByCustomer(customerId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ['vehicles', 'customer', customerId],
    queryFn: () => fetchVehiclesByCustomer(customerId!),
    enabled: enabled && customerId !== null,
  })
}
