"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type AppLayoutMode = "mobile" | "overlay" | "inline";

type SidebarContextValue = {
  layoutMode: AppLayoutMode;
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function getLayoutMode(width: number): AppLayoutMode {
  if (width < 768) return "mobile";
  if (width < 1024) return "overlay";
  return "inline";
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [layoutMode, setLayoutMode] = useState<AppLayoutMode>("inline");
  const [collapsed, setCollapsed] = useState(false);

  const prevModeRef = useRef<AppLayoutMode | null>(null);

  useEffect(() => {
    const update = () => {
      const mode = getLayoutMode(window.innerWidth);
      const prev = prevModeRef.current;

      if (mode === "overlay" && prev !== "overlay") {
        setCollapsed(true);
      }

      prevModeRef.current = mode;
      setLayoutMode(mode);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ layoutMode, collapsed, toggleCollapsed }),
    [layoutMode, collapsed, toggleCollapsed],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
