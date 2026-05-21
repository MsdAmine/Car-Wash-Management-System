import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateEmployee } from '../api'
import { STAFF_KEYS } from './useAllEmployees'

export function useDeactivateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deactivateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.list() })
    },
  })
}
