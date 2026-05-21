import { useMutation } from '@tanstack/react-query';
import { uploadAvatar } from '../api';
import type { UserProfileResponse } from '../types';

export function useUploadAvatar() {
  return useMutation<UserProfileResponse, Error, string>({
    mutationFn: (dataUrl: string) => uploadAvatar(dataUrl),
  });
}
