import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateService } from '../api'
import { SERVICE_KEYS } from './useActiveServices'

export function useDeactivateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deactivateService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.all })
    },
  })
}
