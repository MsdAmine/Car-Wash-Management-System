import { useMutation } from '@tanstack/react-query';
import { updateNotificationPreferences } from '../api';
import type { NotificationPreferences } from '../types';

export function useUpdateNotifications() {
  return useMutation({
    mutationFn: (data: NotificationPreferences) => updateNotificationPreferences(data),
  });
}
