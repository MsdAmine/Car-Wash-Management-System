import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Task #132: Prevents unauthenticated users from accessing private routes.
 */
const ProtectedRoute: React.FC = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. While the AuthContext is still checking for a stored token, 
    // we must show a loading state to prevent flickering.
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-3">Verifying session...</p>
            </div>
        );
    }

    // 2. If no user is found in the global state, redirect to login.
    // We save the 'from' location so we can redirect them back after they log in.
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If authenticated, render the child route (Dashboard, Profile, etc.)
    return <Outlet />;
};

export default ProtectedRoute;