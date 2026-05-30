"use client";

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
  const isIndeterminate = percent === null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-progress-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-white p-6 shadow-lg">
        <h2 id="upload-progress-title" className="text-lg font-semibold">
          Uploading…
        </h2>
        <p className="mt-1 truncate text-sm text-muted-foreground">{fileName}</p>

        <div className="mt-6 space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-primary transition-all duration-300",
                isIndeterminate && "animate-pulse w-full opacity-70"
              )}
              style={
                isIndeterminate ? undefined : { width: `${Math.min(percent, 100)}%` }
              }
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {formatBytes(loaded)}
              {total ? ` of ${formatBytes(total)}` : ""}
            </span>
            <span>{isIndeterminate ? "Preparing…" : `${percent}%`}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Large recordings may take several minutes. Please keep this tab open.
        </p>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Cancel upload
          </button>
        )}
      </div>
    </div>
  );
}
