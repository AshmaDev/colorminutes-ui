"use client";

import { useTranslations } from "next-intl";
import { landingSurfaceClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

type UploadProgressProps = {
  fileName: string;
  percent: number | null;
  loaded: number;
  total: number | null;
  onCancel?: () => void;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function UploadProgress({
  fileName,
  percent,
  loaded,
  total,
  onCancel,
}: UploadProgressProps) {
  const t = useTranslations("uploadProgress");
  const isIndeterminate = percent === null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-progress-title"
    >
      <div className={cn(landingSurfaceClassName, "w-full max-w-md p-6")}>
        <h2
          id="upload-progress-title"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          {t("title")}
        </h2>
        <p className="mt-1 truncate text-sm text-foreground/70">{fileName}</p>

        <div className="mt-6 space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-foreground/[0.06]">
            <div
              className={cn(
                "h-full rounded-full bg-brand-lilac transition-all duration-300",
                isIndeterminate && "w-full animate-pulse opacity-70",
              )}
              style={
                isIndeterminate ? undefined : { width: `${Math.min(percent, 100)}%` }
              }
            />
          </div>
          <div className="flex items-center justify-between text-xs text-foreground/60">
            <span>
              {formatBytes(loaded)}
              {total ? ` of ${formatBytes(total)}` : ""}
            </span>
            <span>{isIndeterminate ? t("preparing") : `${percent}%`}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-foreground/60">{t("hint")}</p>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-4 text-sm text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </div>
  );
}
