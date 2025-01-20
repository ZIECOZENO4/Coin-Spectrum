'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (adminId: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('adminAuth');
    if (authData) {
      const { expiresAt } = JSON.parse(authData);
      if (new Date().getTime() < expiresAt) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const login = async (adminId: string, password: string) => {
    try {
      if (adminId === process.env.NEXT_PUBLIC_ADMIN_ID && 
          password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('adminAuth', JSON.stringify({ expiresAt }));
        setIsAuthenticated(true);
        toast.success('Welcome Admin!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Access denied. Invalid credentials.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    toast.success('Admin logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
