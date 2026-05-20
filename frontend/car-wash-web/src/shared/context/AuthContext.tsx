import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { setAuthToken } from '@/shared/lib/axios';
import type { AuthResponse } from '@/features/auth/types';

export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  EMPLOYEE: 'EMPLOYEE',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface StoredAuthSession {
  user: User;
  token: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_STORAGE_KEY = 'washflow.auth';

function readStoredAuthSession(): StoredAuthSession | null {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as Partial<StoredAuthSession>;
    if (!session.token || !session.user?.email || !session.user.role) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    setAuthToken(session.token);
    return session as StoredAuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<StoredAuthSession | null>(readStoredAuthSession);

  function login(authResponse: AuthResponse): void {
    const nextSession: StoredAuthSession = {
      token: authResponse.token,
      user: {
        email: authResponse.email,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        role: authResponse.role as UserRole,
      },
    };

    setAuthToken(authResponse.token);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function logout(): void {
    setAuthToken(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        isAuthenticated: !!session?.token,
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
