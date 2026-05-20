import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { registerUser } from '../api';
import { ROUTES } from '@/router/routes';

export function useRegister() {
  const navigate = useNavigate();
  const auth = useAuth();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      await auth.login(data);
      if (data.role === 'EMPLOYEE') {
        navigate(ROUTES.PUBLIC.WASHER_PENDING);
      } else {
        navigate(ROUTES.CLIENT.HOME);
      }
    },
  });
}
