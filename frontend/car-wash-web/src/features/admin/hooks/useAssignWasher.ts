import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignWasher } from '../api'
import { ADMIN_KEYS } from './useAdminDashboard'

interface AssignWasherVars {
  bookingId: string
  employeeId: string
}

export function useAssignWasher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, employeeId }: AssignWasherVars) =>
      assignWasher(bookingId, { employeeId }),
    onSuccess: (_data, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.bookings() })
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.assignments(bookingId) })
    },
  })
}
