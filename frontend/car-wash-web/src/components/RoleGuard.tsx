import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';

interface RoleGuardProps {
    allowedRoles: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    // Still resolving auth state — render nothing to avoid a flash.
    if (loading) return null;

    const userRole = user?.role ?? '';
    const normalizedUserRole = userRole.toUpperCase().replace('ROLE_', '');

    const hasAccess = allowedRoles.some(
        (role) => role.toUpperCase().replace('ROLE_', '') === normalizedUserRole
    );

    if (!hasAccess) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleGuard;
