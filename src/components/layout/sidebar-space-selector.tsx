"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

type SidebarSpaceSelectorProps = {
  collapsed?: boolean;
};

export function SidebarSpaceSelector({ collapsed = false }: SidebarSpaceSelectorProps) {
  const t = useTranslations("sidebar");
  const { space, isLoading } = useAuth();

  if (isLoading || !space) {
    return (
      <div
        className={cn(
          "border-b border-sidebar-border",
          collapsed ? "mb-4 flex w-full justify-center pb-3" : "mb-4 w-full pb-3",
        )}
      >
        <div
          className={cn(
            "animate-pulse bg-sidebar-accent/50",
            collapsed ? "size-9 rounded-lg" : "mt-4 h-10 w-full rounded-lg",
          )}
        />
      </div>
    );
  }

  const spaceInitial = space.name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "border-b border-sidebar-border",
        collapsed ? "mb-4 flex w-full justify-center pb-3" : "mb-4 w-full pb-3",
      )}
    >
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
                  : "mt-4 h-auto w-full justify-between gap-2 rounded-lg px-3 py-2.5",
              )}
              aria-label={t("spaceMenu")}
            />
          }
        >
          {collapsed ? (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent/80 text-sm font-semibold text-sidebar-foreground">
              {spaceInitial}
            </span>
          ) : (
            <>
              <span className="min-w-0 truncate text-sm font-semibold">{space.name}</span>
              <ChevronDown
                className="size-4 shrink-0 text-sidebar-foreground/50"
                aria-hidden
              />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={12}
          className="flex w-64 flex-col gap-2 p-4"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              className={cn(
                "cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
              onSelect={(event) => event.preventDefault()}
            >
              {space.name}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
