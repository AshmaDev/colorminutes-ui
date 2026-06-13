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
import type { Space, User } from "@/lib/schemas";

type AuthContextValue = {
  user: User | null;
  space: Space | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    space: {
      name: string;
      visibility: "private" | "public" | "protected";
      password?: string;
    };
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setSpace: (space: Space) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setSpace(null);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me.user);
      setSpace(me.space);
    } catch {
      clearToken();
      setUser(null);
      setSpace(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve()
      .then(() => refreshUser())
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      const data = await authApi.login(input);
      setUser(data.user);
      setSpace(data.space);
    },
    []
  );

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      space: {
        name: string;
        visibility: "private" | "public" | "protected";
        password?: string;
      };
    }) => {
      const data = await authApi.register(input);
      setUser(data.user);
      setSpace(data.space);
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setSpace(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const setSpaceState = useCallback((nextSpace: Space) => {
    setSpace(nextSpace);
  }, []);

  const value = useMemo(
    () => ({
      user,
      space,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
      setSpace: setSpaceState,
    }),
    [user, space, isLoading, login, register, logout, refreshUser, setSpaceState]
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
