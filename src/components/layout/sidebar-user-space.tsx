"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

type SidebarUserSpaceProps = {
  collapsed?: boolean;
};

export function SidebarUserSpace({ collapsed = false }: SidebarUserSpaceProps) {
  const t = useTranslations("header");
  const { user, isLoading, logout } = useAuth();

  if (isLoading || !user) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-full bg-sidebar-accent/50",
          collapsed ? "size-9" : "h-11 w-full rounded-lg",
        )}
      />
    );
  }

  const initial = user.email.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size={collapsed ? "icon-sm" : "default"}
            className={cn(
              "hover:bg-sidebar-accent",
              collapsed
                ? "size-9 shrink-0 rounded-lg p-0"
                : "h-auto w-full justify-start gap-3 px-3 py-2",
            )}
            aria-label={t("accountMenu")}
          />
        }
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-lilac/50 text-sm font-medium text-foreground">
          {initial}
        </span>
        {!collapsed && (
          <span className="min-w-0 truncate text-left text-sm font-medium">
            {user.email}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={collapsed ? "start" : "start"}
        sideOffset={8}
        className="w-56"
      >
        <DropdownMenuItem render={<Link href="/profile" />}>
          {t("profile")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          {t("logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
