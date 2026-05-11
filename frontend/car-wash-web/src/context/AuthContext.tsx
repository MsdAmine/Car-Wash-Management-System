import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authService from '../services/authService';
import type { User, RegisterRequest } from '../types/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<User>; // Returns User now
    register: (data: RegisterRequest) => Promise<User>; // Returns User now
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

    const login = async (credentials: any): Promise<User> => {
        try {
            const userData = await authService.login(credentials);
            const authenticatedUser = {
                email: userData.email,
                role: userData.role,
                firstName: userData.firstName,
                lastName: userData.lastName
            } as User;

            setUser(authenticatedUser);
            return authenticatedUser;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const register = async (data: RegisterRequest): Promise<User> => {
        try {
            const userData = await authService.register(data);
            const authenticatedUser = {
                email: userData.email,
                role: userData.role,
                firstName: userData.firstName,
                lastName: userData.lastName
            } as User;

            setUser(authenticatedUser);
            return authenticatedUser;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        // 1. Clear the localStorage token
        authService.logout();

        // 2. Clear React state (optional but good practice)
        setUser(null);

        // 3. Hard reset to clear memory and redirect
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