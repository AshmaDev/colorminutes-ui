"use client";

import { AppBottomTabs } from "@/components/layout/app-bottom-tabs";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/layout/sidebar-provider";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

function AppShellContent({ children }: AppShellProps) {
  const { layoutMode, collapsed } = useSidebar();
  const isOverlayExpanded = layoutMode === "overlay" && !collapsed;
  const reservedWidth = collapsed ? "w-16" : "w-64";

  return (
    <div className="flex min-h-screen text-foreground">
      <AppSidebar />
      <div
        aria-hidden
        className={cn(
          "hidden shrink-0 md:block",
          isOverlayExpanded ? "w-0" : reservedWidth,
        )}
      />
      <main className="flex min-h-screen min-w-0 flex-1 flex-col overflow-auto bg-muted pb-16 md:pb-0">
        {children}
      </main>
      <AppBottomTabs />
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}
