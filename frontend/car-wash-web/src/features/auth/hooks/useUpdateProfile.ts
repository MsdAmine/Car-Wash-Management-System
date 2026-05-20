import { useMutation } from '@tanstack/react-query'
import { updateUserProfile } from '../api'
import type { UpdateProfileRequest } from '../types'

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateUserProfile(data),
  })
}
