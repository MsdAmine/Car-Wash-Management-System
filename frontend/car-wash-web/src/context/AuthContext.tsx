import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authService from '../services/authService';
import type { User, RegisterRequest } from '../types/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
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
        // Always stop loading regardless of success/fail
        setLoading(false);
    };

    useEffect(() => {
        refreshProfile();
    }, []);

    const login = async (credentials: any) => {
        try {
            const userData = await authService.login(credentials);
            if (userData && userData.email) {
                setUser({
                    email: userData.email,
                    role: userData.role,
                    firstName: userData.firstName,
                    lastName: userData.lastName
                } as User);
            } else {
                await refreshProfile();
            }
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const userData = await authService.register(data);
            if (userData && userData.email) {
                setUser({
                    email: userData.email,
                    role: userData.role,
                    firstName: userData.firstName,
                    lastName: userData.lastName
                } as User);
            } else {
                await refreshProfile();
            }
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        // Using navigate is usually cleaner, but this works for a hard reset
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile }}>
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