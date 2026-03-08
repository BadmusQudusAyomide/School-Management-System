import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginForm, SchoolSignupForm, ApiResponse, School } from '../types/index';
import { api } from '../lib/api';
import {
  clearAuthStorage,
  getStoredUser,
  setStoredAccessToken,
  setStoredUser,
} from '../lib/authStorage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginForm | string, password?: string) => Promise<boolean>;
  signupAdmin: (payload: SchoolSignupForm) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  const persistAuthSession = (authData: { user: User; accessToken: string }) => {
    setStoredAccessToken(authData.accessToken);
    setStoredUser(authData.user);
    setUser(authData.user);
  };

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginForm | string, password?: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const payload =
        typeof credentials === 'string'
          ? { email: credentials, password: password ?? '' }
          : credentials;

      const response = await api.post<ApiResponse<{
        user: User;
        accessToken: string;
      }>>('/auth/login', payload);

      persistAuthSession(response.data.data);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signupAdmin = async (payload: SchoolSignupForm): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await api.post<ApiResponse<{
        user: User;
        school: School;
        accessToken: string;
      }>>('/auth/admin-signup', payload);

      persistAuthSession(response.data.data);
      return true;
    } catch (error) {
      console.error('Admin signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }

    setUser(null);
    clearAuthStorage();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signupAdmin,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
