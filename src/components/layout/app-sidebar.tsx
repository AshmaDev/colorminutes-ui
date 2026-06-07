"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarUserSpace } from "@/components/layout/sidebar-user-space";
import { useSidebar } from "@/components/layout/sidebar-provider";
import { isMeetingsActive, isNewMeetingActive } from "@/lib/app-nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const t = useTranslations("sidebar");
  const tHeader = useTranslations("header");
  const tFooter = useTranslations("footer");
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const { layoutMode, collapsed, toggleCollapsed } = useSidebar();

  const isNewMeeting = isNewMeetingActive(pathname);
  const isMeetingsLink = isMeetingsActive(pathname);
  const isOverlayExpanded = layoutMode === "overlay" && !collapsed;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        collapsed ? "w-16" : "w-64",
        isOverlayExpanded && "z-50 shadow-lg shadow-black/5",
      )}
    >
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <SidebarUserSpace collapsed={false} />
        </div>
      )}

      <nav
        className={cn(
          "flex flex-1 flex-col gap-3",
          collapsed ? "items-center px-2 pt-4" : "px-3",
        )}
      >
        {collapsed && <SidebarUserSpace collapsed />}
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

        <Button
          variant="ghost"
          size={collapsed ? "icon-sm" : "default"}
          onClick={toggleCollapsed}
          className={cn(
            "mt-auto text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed ? "size-9" : "w-full justify-start gap-2",
          )}
          aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
        >
          {collapsed ? (
            <ChevronRight className="size-4" aria-hidden />
          ) : (
            <>
              <ChevronLeft className="size-4" aria-hidden />
              {t("collapseSidebar")}
            </>
          )}
        </Button>
      </nav>

      {!collapsed && (
        <div className="mt-auto flex flex-col gap-4 p-4">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-3">
            <p className="text-sm font-medium text-sidebar-foreground">
              {t("freeDemo")}
            </p>
          </div>
          <p className="text-xs text-sidebar-foreground/50">
            {tFooter("copyright", { year })}
          </p>
        </div>
      )}
    </aside>
  );
}
