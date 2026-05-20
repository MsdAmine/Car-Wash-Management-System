import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createVehicle } from '../api'
import { VEHICLE_KEYS } from './useMyVehicles'

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_KEYS.my() })
    },
  })
}
