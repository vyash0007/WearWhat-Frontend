"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/auth';
import type { User, LoginRequest, SignupRequest } from '@/lib/api/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: SignupRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'wearwhat_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const message = (error as { message?: string }).message || 'Login failed';
      return { success: false, message };
    }
  }, []);

  const signup = useCallback(async (userData: SignupRequest) => {
    try {
      const response = await authService.signup(userData);
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
        return { success: true };
      }
      return { success: false, message: response.message || 'Signup failed' };
    } catch (error) {
      const message = (error as { message?: string }).message || 'Signup failed';
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Continue with local logout even if API call fails
    }
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    // Clear all React Query cache to prevent stale data on next login
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
