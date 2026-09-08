'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionUser } from '@/lib/auth/session';
import { logoutAction, getCurrentUserAction } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';

interface SessionContextType {
  user: SessionUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export function SessionProvider({
  initialUser,
  children,
}: {
  initialUser: SessionUser | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUserAction();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutAction();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionContext.Provider value={{ user, isLoading, logout, refreshUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
