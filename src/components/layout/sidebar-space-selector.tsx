"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateSpaceDialog } from "@/components/spaces/create-space-dialog";
import { spacesApi } from "@/lib/api/spaces";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const spaceMenuItemClassName =
  "cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:bg-sidebar-accent/50 focus:text-sidebar-foreground";

type SidebarSpaceSelectorProps = {
  collapsed?: boolean;
};

export function SidebarSpaceSelector({ collapsed = false }: SidebarSpaceSelectorProps) {
  const t = useTranslations("sidebar");
  const { space, isLoading, switchSpace } = useAuth();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: spaces = [] } = useQuery({
    queryKey: ["spaces"],
    queryFn: spacesApi.list,
    enabled: !isLoading && !!space,
  });

  if (isLoading || !space) {
    return (
      <div
        className={cn(
          "border-b border-sidebar-border",
          collapsed ? "mb-3 flex w-full justify-center px-2 pb-3" : "mb-3 w-full px-3 pt-3 pb-3",
        )}
      >
        <div
          className={cn(
            "animate-pulse bg-sidebar-accent/50",
            collapsed ? "size-9 rounded-lg" : "h-10 w-full rounded-lg",
          )}
        />
      </div>
    );
  }

  const activeSpace = space;
  const spaceInitial = activeSpace.name.charAt(0).toUpperCase();
  const listedSpaces = spaces.length > 0 ? spaces : [activeSpace];

  function handleSwitch(nextSpaceId: string) {
    const nextSpace = listedSpaces.find((item) => item.id === nextSpaceId);
    if (!nextSpace || nextSpace.id === activeSpace.id) return;
    switchSpace(nextSpace);
    void queryClient.invalidateQueries({ queryKey: ["meetings"] });
  }

  function handleCreated(newSpace: (typeof listedSpaces)[number]) {
    void queryClient.invalidateQueries({ queryKey: ["spaces"] });
    switchSpace(newSpace);
    void queryClient.invalidateQueries({ queryKey: ["meetings"] });
  }

  return (
    <>
      <div
        className={cn(
          "border-b border-sidebar-border",
          collapsed ? "mb-3 flex w-full justify-center px-2 pb-3" : "mb-3 w-full px-3 pt-3 pb-3",
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
                    : "h-auto w-full justify-between gap-2 rounded-lg px-3 py-2",
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
                <span className="min-w-0 truncate text-sm font-semibold">{activeSpace.name}</span>
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
              {listedSpaces.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className={cn(
                    spaceMenuItemClassName,
                    item.id === activeSpace.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70",
                  )}
                  onClick={() => handleSwitch(item.id)}
                >
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn(spaceMenuItemClassName, "text-sidebar-foreground/70")}
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="size-4 shrink-0" aria-hidden />
              {t("newSpace")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreateSpaceDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
