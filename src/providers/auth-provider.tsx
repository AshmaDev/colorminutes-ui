"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { clearToken, getToken } from "@/lib/api/token";
import type { User } from "@/lib/schemas";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      const data = await authApi.login(input);
      setUser(data.user);
    },
    []
  );

  const register = useCallback(
    async (input: { email: string; password: string }) => {
      const data = await authApi.register(input);
      setUser(data.user);
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
