import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../api';
import { ROUTES } from '@/router/routes';

export function useForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      const params = new URLSearchParams({
        token: data.resetToken,
        expiresAt: data.expiresAt,
      });
      navigate(`${ROUTES.PUBLIC.RESET_PASSWORD}?${params.toString()}`);
    },
  });
}
