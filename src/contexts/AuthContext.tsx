"use client";

import type { User, UserRole } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem('currentUser') : null;
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith('/login') && pathname !== '/') {
      router.replace('/login');
    }
  }, [user, loading, router, pathname]);

  const login = async (email: string, role: UserRole) => {
    const mockUser: User = { 
      id: Date.now().toString(), 
      email, 
      role, 
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) 
    };
    if (typeof window !== "undefined") {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
    }
    setUser(mockUser);
    if (role === 'admin') {
      router.push('/admin/products');
    } else {
      router.push('/user/distributions');
    }
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('currentUser');
    }
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
