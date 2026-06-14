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
import { spacesApi } from "@/lib/api/spaces";
import { clearToken, getToken } from "@/lib/api/token";
import type { Space, User } from "@/lib/schemas";

const ACTIVE_SPACE_KEY = "colorminutes-active-space-id";

function getPersistedSpaceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_SPACE_KEY);
}

function persistSpaceId(id: string) {
  localStorage.setItem(ACTIVE_SPACE_KEY, id);
}

function clearPersistedSpaceId() {
  localStorage.removeItem(ACTIVE_SPACE_KEY);
}

function resolveActiveSpace(
  spaces: Space[],
  fallbackSpace: Space | null
): Space | null {
  const persistedId = getPersistedSpaceId();
  if (persistedId) {
    const persisted = spaces.find((space) => space.id === persistedId);
    if (persisted) return persisted;
  }
  if (fallbackSpace && spaces.some((space) => space.id === fallbackSpace.id)) {
    return fallbackSpace;
  }
  return spaces[0] ?? null;
}

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
  switchSpace: (space: Space) => void;
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
      const spaces = await spacesApi.list();
      const activeSpace = resolveActiveSpace(spaces, me.space);
      setUser(me.user);
      setSpace(activeSpace);
      if (activeSpace) {
        persistSpaceId(activeSpace.id);
      }
    } catch {
      clearToken();
      clearPersistedSpaceId();
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
      const spaces = await spacesApi.list();
      const activeSpace = resolveActiveSpace(spaces, data.space);
      setUser(data.user);
      setSpace(activeSpace);
      if (activeSpace) {
        persistSpaceId(activeSpace.id);
      }
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
      persistSpaceId(data.space.id);
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    clearPersistedSpaceId();
    setUser(null);
    setSpace(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const setSpaceState = useCallback((nextSpace: Space) => {
    setSpace(nextSpace);
    persistSpaceId(nextSpace.id);
  }, []);

  const switchSpace = useCallback((nextSpace: Space) => {
    setSpace(nextSpace);
    persistSpaceId(nextSpace.id);
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
      switchSpace,
    }),
    [
      user,
      space,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      setSpaceState,
      switchSpace,
    ]
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
