import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import type { UserRole } from '@/shared/context/AuthContext';
import { ROUTES } from './routes';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialised, user } = useAuth();

  if (!isInitialised) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.PUBLIC.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
}
