import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../api';
import { ROUTES } from '@/router/routes';

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate(ROUTES.PUBLIC.LOGIN, {
        replace: true,
        state: { passwordReset: true },
      });
    },
  });
}
