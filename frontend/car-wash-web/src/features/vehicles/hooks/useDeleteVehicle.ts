import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteVehicle } from '../api'
import { VEHICLE_KEYS } from './useMyVehicles'

export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_KEYS.my() })
    },
  })
}
