import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateEmployee } from '../api'
import { STAFF_KEYS } from './useAllEmployees'

export function useActivateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => activateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.list() })
    },
  })
}
