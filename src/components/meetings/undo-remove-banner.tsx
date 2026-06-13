"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UndoRemoveBannerProps = {
  message: string;
  undoLabel: string;
  onUndo: () => void;
  className?: string;
};

export function UndoRemoveBanner({
  message,
  undoLabel,
  onUndo,
  className,
}: UndoRemoveBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-foreground/10 bg-background/95 px-4 py-2.5 text-sm shadow-lg backdrop-blur-sm",
        className,
      )}
    >
      <span className="text-foreground/80">{message}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 font-medium text-foreground underline-offset-4 hover:underline"
        onClick={onUndo}
      >
        {undoLabel}
      </Button>
    </div>
  );
}
