import { useQuery } from '@tanstack/react-query'
import { fetchEmployeeBookingDetails } from '../api'
import { STAFF_KEYS } from './useAllEmployees'

export function useEmployeeBookingDetails(employeeId?: string, enabled = true) {
  return useQuery({
    queryKey: STAFF_KEYS.bookings(employeeId ?? 'unknown'),
    queryFn: () => fetchEmployeeBookingDetails(employeeId!),
    enabled: enabled && Boolean(employeeId),
  })
}
