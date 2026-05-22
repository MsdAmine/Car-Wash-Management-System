import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEmployee, type UpdateEmployeeBody } from '../api'
import { STAFF_KEYS } from './useAllEmployees'

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeBody }) =>
      updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.list() })
    },
  })
}
