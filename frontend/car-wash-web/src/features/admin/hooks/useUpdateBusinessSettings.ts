import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBusinessSettings } from '../api'
import { SETTINGS_KEYS } from './useBusinessSettings'

export function useUpdateBusinessSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBusinessSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.business() })
    },
  })
}
