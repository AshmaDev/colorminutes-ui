"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { getPublishStatusKey } from "@/lib/meeting-publish";

type PublishStatusProps = {
  publishedAt: string | null;
  className?: string;
};

const statusStyles = {
  published: "text-emerald-700",
  unpublished: "text-muted-foreground",
} as const;

export function PublishStatus({ publishedAt, className }: PublishStatusProps) {
  const t = useTranslations("meetings");
  const key = getPublishStatusKey({ publishedAt });

  return (
    <span className={cn("text-xs font-medium", statusStyles[key], className)}>
      {t(`publishStatusLabels.${key}`)}
    </span>
  );
}
