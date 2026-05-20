import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateVehicle } from '../api'
import { VEHICLE_KEYS } from './useMyVehicles'
import type { VehicleRequest } from '../types'

export function useUpdateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VehicleRequest }) =>
      updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_KEYS.my() })
    },
  })
}
