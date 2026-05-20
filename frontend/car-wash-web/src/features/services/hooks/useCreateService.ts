import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createService } from '../api'
import { SERVICE_KEYS } from './useActiveServices'
import type { WashServiceRequest } from '../types'

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: WashServiceRequest) => createService(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.all })
    },
  })
}
