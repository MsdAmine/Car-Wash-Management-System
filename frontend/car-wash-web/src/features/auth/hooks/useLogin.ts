import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { loginUser } from '../api';
import { ROUTES } from '@/router/routes';

interface LoginVariables {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function useLogin() {
  const navigate = useNavigate();
  const auth = useAuth();

  return useMutation({
    mutationFn: ({ email, password }: LoginVariables) => loginUser({ email, password }),
    onSuccess: async (data, variables) => {
      await auth.login(data, variables.rememberMe ?? false);
      if (data.role === 'ADMIN') {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else if (data.role === 'EMPLOYEE') {
        navigate(ROUTES.WASHER.HOME);
      } else {
        navigate(ROUTES.CLIENT.HOME);
      }
    },
  });
}
