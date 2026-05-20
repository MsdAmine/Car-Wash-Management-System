import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { loginUser } from '../api';
import { ROUTES } from '@/router/routes';

export function useLogin() {
  const navigate = useNavigate();
  const auth = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      auth.login(data);
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
