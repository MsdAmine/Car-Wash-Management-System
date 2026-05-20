import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '@/shared/lib/axios';
import type { AuthResponse } from '@/features/auth/types';
import { fetchUserProfile } from '@/features/auth/api';
import { ROUTES } from '@/router/routes';

export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  EMPLOYEE: 'EMPLOYEE',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialised: boolean;
  login: (authResponse: AuthResponse) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_TOKEN_KEY = 'auth_token';
const SESSION_USER_KEY = 'auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(SESSION_TOKEN_KEY),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialised, setIsInitialised] = useState(false);

  async function hydrateFromProfile(tok: string): Promise<void> {
    setAuthToken(tok);
    try {
      const profile = await fetchUserProfile();
      setUser({
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role as UserRole,
      });
      setIsAuthenticated(true);
    } catch {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      sessionStorage.removeItem(SESSION_USER_KEY);
      setAuthToken(null);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (storedToken) {
      hydrateFromProfile(storedToken).finally(() => setIsInitialised(true));
    } else {
      setIsInitialised(true);
    }
  }, []);

  async function login(authResponse: AuthResponse): Promise<void> {
    sessionStorage.setItem(SESSION_TOKEN_KEY, authResponse.token);
    setToken(authResponse.token);
    setAuthToken(authResponse.token);
    await hydrateFromProfile(authResponse.token);
  }

  function logout(): void {
    setAuthToken(null);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate(ROUTES.PUBLIC.LOGIN);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isInitialised,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
