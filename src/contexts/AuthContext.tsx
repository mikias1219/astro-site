'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api';

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'editor' | 'user';
  is_active: boolean;
  is_verified: boolean;
  preferred_language: string;
  created_at: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVerified: boolean;
}

interface RegisterData {
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  password: string;
  preferred_language?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // Verify token and get user data
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await apiClient.getCurrentUser(token);
      if (response.success) {
        setUser(response.data as unknown as User);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token');
        setToken(null);
      }
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      const response = await apiClient.login(username, password);
      
      if (response.success && response.data) {
        const { access_token } = response.data as any;
        setToken(access_token);
        localStorage.setItem('auth_token', access_token);
        
        // Get user data
        const userResponse = await apiClient.getCurrentUser(access_token);
        if (userResponse.success) {
          setUser(userResponse.data as unknown as User);
          return { success: true };
        }
      }
      return { success: false, message: (response as any).error || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      const response = await apiClient.register(userData);
      
      if (response.success) {
        return { 
          success: true, 
          message: (response.data as any)?.message || 'Registration successful! Please check your email to verify your account.' 
        };
      }
      return { success: false, message: (response as any).error || 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isVerified: user?.is_verified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
