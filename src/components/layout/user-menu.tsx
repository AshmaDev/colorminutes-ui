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
import { useAuth } from "@/providers/auth-provider";

export function UserMenu() {
  const t = useTranslations("header");
  const { user, isLoading, logout } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  const initial = user.email.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="gap-2 px-2"
            aria-label={t("accountMenu")}
          />
        }
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary-foreground">
          {initial}
        </span>
        <span className="hidden max-w-[140px] truncate sm:inline">{user.email}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
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
