import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateService } from '../api'
import { SERVICE_KEYS } from './useActiveServices'
import type { WashServiceRequest } from '../types'

interface UpdateServiceVars {
  id: string
  data: WashServiceRequest
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: UpdateServiceVars) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.all })
    },
  })
}
