"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { CalendarDays, Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  isMeetingsActive,
  isNewMeetingActive,
  isProfileActive,
  isSpaceSettingsActive,
} from "@/lib/app-nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

function TabLink({
  href,
  active,
  icon: Icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors",
        active
          ? "text-sidebar-primary"
          : "text-sidebar-foreground/60 hover:text-sidebar-foreground",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AppBottomTabs() {
  const t = useTranslations("sidebar");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  const initial = user?.email.charAt(0).toUpperCase() ?? "?";
  const isAccountActive =
    isProfileActive(pathname) || isSpaceSettingsActive(pathname);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden">
      <div className="flex h-16 items-stretch">
        <TabLink
          href="/meetings/new"
          active={isNewMeetingActive(pathname)}
          icon={Plus}
          label={t("newMeeting")}
        />
        <TabLink
          href="/meetings"
          active={isMeetingsActive(pathname)}
          icon={CalendarDays}
          label={tHeader("meetings")}
        />
        {isLoading || !user ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="size-8 animate-pulse rounded-full bg-sidebar-accent" />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className={cn(
                    "h-auto flex-1 flex-col gap-1 rounded-none px-2 py-2 text-xs font-medium hover:bg-sidebar-accent",
                    isAccountActive
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/60",
                  )}
                  aria-label={tHeader("accountMenu")}
                />
              }
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-lilac/50 text-[10px] font-medium text-foreground">
                {initial}
              </span>
              <span>{tHeader("profile")}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" sideOffset={8}>
              <DropdownMenuItem render={<Link href="/profile" />}>
                {tHeader("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/space/settings" />}>
                {t("spaceSettings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={logout}>
                {tHeader("logOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
