import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types/index';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Mock authentication - replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@school.com',
          firstName: 'John',
          lastName: 'Admin',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          phone: '+1234567890',
          address: '123 Admin St',
          schoolId: 'school-1',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          email: 'teacher@school.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'teacher',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          phone: '+1234567891',
          address: '456 Teacher Ave',
          schoolId: 'school-1',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          email: 'student@school.com',
          firstName: 'Mike',
          lastName: 'Johnson',
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          phone: '+1234567892',
          address: '789 Student Rd',
          schoolId: 'school-1',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          email: 'parent@school.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'parent',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          phone: '+1234567893',
          address: '789 Student Rd',
          schoolId: 'school-1',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          email: 'accountant@school.com',
          firstName: 'David',
          lastName: 'Brown',
          role: 'accountant',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
          phone: '+1234567894',
          address: '321 Finance St',
          schoolId: 'school-1',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password123') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
