import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import authService from '../services/authService';
import type { User, RegisterRequest, LoginRequest } from '../types/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<User>;
    register: (data: RegisterRequest) => Promise<User>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = useCallback(async () => {
        const token = authService.getToken();
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const profile = await authService.getProfile();
            setUser(profile);
        } catch {
            // Token is invalid or expired — clear it silently.
            authService.clearSession();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    const login = async (credentials: LoginRequest): Promise<User> => {
        await authService.login(credentials);
        // Fetch the full profile so we always have the complete User (including id).
        const profile = await authService.getProfile();
        setUser(profile);
        return profile;
    };

    const register = async (data: RegisterRequest): Promise<User> => {
        await authService.register(data);
        const profile = await authService.getProfile();
        setUser(profile);
        return profile;
    };

    const logout = () => {
        authService.clearSession();
        setUser(null);
        // Single, authoritative redirect to login.
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
