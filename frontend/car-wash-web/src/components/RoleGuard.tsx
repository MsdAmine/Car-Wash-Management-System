import React, { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
    allowedRoles: string[];
}

/**
 * RoleGuard Component
 * Task #132: Restricts access based on user roles.
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Calculate permission
    const userRole = user?.role;
    const hasAccess = !!(user && allowedRoles.some(role => {
        if (!userRole) return false;
        const normalizedUserRole = String(userRole).toUpperCase().replace('ROLE_', '');
        const normalizedAllowedRole = String(role).toUpperCase().replace('ROLE_', '');
        return normalizedUserRole === normalizedAllowedRole;
    }));

    // 2. Perform redirect via useEffect (more reliable for some router versions)
    useEffect(() => {
        if (!loading && !hasAccess && location.pathname !== '/') {
            console.warn(`[RoleGuard] Redirecting from ${location.pathname} to /`);
            // We use a small timeout to ensure we are out of the render cycle
            const timer = setTimeout(() => {
                navigate('/', { replace: true });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [loading, hasAccess, location.pathname, navigate]);

    // 3. While checking, render nothing
    if (loading) return null;

    // 4. If no access, return null while the useEffect handles the redirect
    if (!hasAccess) return null;

    // 5. If authorized, render the child routes
    return <Outlet />;
};

export default RoleGuard;