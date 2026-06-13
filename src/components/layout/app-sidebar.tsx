"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarSpaceSelector } from "@/components/layout/sidebar-space-selector";
import {
  sidebarFooterControlClassName,
  SidebarUserBlock,
} from "@/components/layout/sidebar-user-block";
import { useSidebar } from "@/components/layout/sidebar-provider";
import { isMeetingsActive, isNewMeetingActive, isSpaceSettingsActive } from "@/lib/app-nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const t = useTranslations("sidebar");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const { layoutMode, collapsed, toggleCollapsed } = useSidebar();

  const isNewMeeting = isNewMeetingActive(pathname);
  const isMeetingsLink = isMeetingsActive(pathname);
  const isSpaceSettings = isSpaceSettingsActive(pathname);
  const isOverlayExpanded = layoutMode === "overlay" && !collapsed;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        collapsed ? "w-16" : "w-64",
        isOverlayExpanded && "z-50 shadow-lg shadow-black/5",
      )}
    >
      {!collapsed && <SidebarSpaceSelector />}

      <nav
        className={cn(
          "flex flex-1 flex-col gap-3",
          collapsed ? "items-center px-2 pt-4" : "px-3",
        )}
      >
        {collapsed && <SidebarSpaceSelector collapsed />}
        <Button
          render={<Link href="/meetings/new" />}
          variant="landing"
          size={collapsed ? "icon-sm" : "default"}
          className={cn(
            collapsed ? "size-9" : "w-full justify-start gap-2",
            isNewMeeting && "ring-2 ring-sidebar-ring",
          )}
          title={collapsed ? t("newMeeting") : undefined}
          aria-label={t("newMeeting")}
        >
          <Plus className="size-4" aria-hidden />
          {!collapsed && t("newMeeting")}
        </Button>

        <Link
          href="/meetings"
          title={collapsed ? tHeader("meetings") : undefined}
          aria-label={tHeader("meetings")}
          className={cn(
            "flex items-center rounded-lg text-sm font-medium transition-colors",
            collapsed
              ? "size-9 justify-center"
              : "gap-2 px-3 py-2",
            isMeetingsLink
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
          )}
        >
          <CalendarDays className="size-4 shrink-0" aria-hidden />
          {!collapsed && tHeader("meetings")}
        </Link>

        <Link
          href="/space/settings"
          title={collapsed ? t("spaceSettings") : undefined}
          aria-label={t("spaceSettings")}
          className={cn(
            "flex items-center rounded-lg text-sm font-medium transition-colors",
            collapsed
              ? "size-9 justify-center"
              : "gap-2 px-3 py-2",
            isSpaceSettings
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
          )}
        >
          <Settings className="size-4 shrink-0" aria-hidden />
          {!collapsed && t("spaceSettings")}
        </Link>

        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            sidebarFooterControlClassName,
            "mt-auto mb-4 py-2",
            collapsed ? "justify-center" : "justify-start gap-2 px-3",
            "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
          )}
          aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
        >
          {collapsed ? (
            <ChevronRight className="size-4 shrink-0" aria-hidden />
          ) : (
            <>
              <ChevronLeft className="size-4 shrink-0" aria-hidden />
              {t("collapseSidebar")}
            </>
          )}
        </button>
      </nav>

      <SidebarUserBlock collapsed={collapsed} />
    </aside>
  );
}
