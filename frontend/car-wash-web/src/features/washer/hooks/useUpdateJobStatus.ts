import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBookingStatus } from '../api'
import { WASHER_KEYS } from './useMyJobsToday'

export function useUpdateJobStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'IN_PROGRESS' | 'COMPLETED' }) =>
      updateBookingStatus(id, { status }),
    onSuccess: (updatedBooking) => {
      queryClient.invalidateQueries({ queryKey: WASHER_KEYS.jobsToday() })
      queryClient.invalidateQueries({ queryKey: WASHER_KEYS.history() })
      queryClient.invalidateQueries({ queryKey: WASHER_KEYS.job(updatedBooking.id) })
    },
  })
}
