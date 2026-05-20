import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOperatingHours } from '../api'
import { SETTINGS_KEYS } from './useBusinessSettings'

export function useUpdateOperatingHours() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateOperatingHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.hours() })
    },
  })
}
