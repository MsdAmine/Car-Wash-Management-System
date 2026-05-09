import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { User } from '../types/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        const token = authService.getToken();
        if (token) {
            try {
                const profile = await authService.getProfile();
                setUser(profile);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                authService.logout();
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshProfile();
    }, []);

    const login = async (credentials: any) => {
        // 1. Get the 'data' object from the service
        const userData = await authService.login(credentials);

        // 2. Map the fields to your User state
        // Your JSON uses 'firstName' and 'lastName' directly in the data object
        if (userData) {
            setUser({
                email: userData.email,
                role: userData.role,
                firstName: userData.firstName,
                lastName: userData.lastName
            } as User);
        } else {
            await refreshProfile();
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};