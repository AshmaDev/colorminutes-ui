"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isProfileActive } from "@/lib/app-nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const sidebarMenuItemClassName =
  "cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:bg-sidebar-accent/50 focus:text-sidebar-foreground";

export const sidebarFooterControlClassName =
  "flex h-[52px] w-full shrink-0 items-center rounded-lg text-sm font-medium transition-colors";

export const sidebarFooterSectionClassName = (collapsed: boolean) =>
  cn("mt-3 border-t border-sidebar-border py-3 pb-4", collapsed ? "px-2" : "px-3");

type SidebarUserBlockProps = {
  collapsed?: boolean;
};

export function SidebarUserBlock({ collapsed = false }: SidebarUserBlockProps) {
  const t = useTranslations("sidebar");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const isProfile = isProfileActive(pathname);

  if (isLoading || !user) {
    return (
      <div className={sidebarFooterSectionClassName(collapsed)}>
        <div className="h-[52px] w-full animate-pulse rounded-lg bg-sidebar-accent/50" />
      </div>
    );
  }

  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div className={sidebarFooterSectionClassName(collapsed)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className={cn(
                sidebarFooterControlClassName,
                "hover:bg-sidebar-accent",
                collapsed ? "justify-center p-0" : "justify-start gap-3 px-2",
              )}
              aria-label={tHeader("accountMenu")}
            />
          }
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-lilac/50 text-sm font-medium text-foreground">
            {initial}
          </span>
          {!collapsed && (
            <span className="min-w-0 text-left">
              <span className="block truncate text-sm font-medium">{user.email}</span>
              <span className="block truncate text-xs text-sidebar-foreground/60">
                {t("freeDemo")}
              </span>
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={12}
          className="flex w-64 flex-col gap-2 p-4"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="mb-2 border-b border-border px-3 pb-3 text-xs font-medium text-sidebar-foreground/60">
              {user.email}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem
            render={<Link href="/profile" />}
            className={cn(
              sidebarMenuItemClassName,
              isProfile
                ? "bg-sidebar-accent text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70",
            )}
          >
            <User className="size-4 shrink-0" aria-hidden />
            {tHeader("profile")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={logout}
            className={cn(
              sidebarMenuItemClassName,
              "text-destructive focus:bg-destructive/10 focus:text-destructive",
            )}
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            {tHeader("logOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
