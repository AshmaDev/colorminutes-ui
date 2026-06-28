"use client";

import { useTranslations } from "next-intl";
import type { SectionTag } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type TagFilterChipsProps = {
  tags: SectionTag[];
  activeTag: string | null;
  onChange: (tagSlug: string | null) => void;
  className?: string;
};

export function TagFilterChips({
  tags,
  activeTag,
  onChange,
  className,
}: TagFilterChipsProps) {
  const t = useTranslations("meetings");

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={cn("cm-group-toggle-wrap no-print", className)}>
      <span className="self-center text-sm font-semibold text-[#6b7280]">
        {t("filterByTopic")}
      </span>
      <button
        type="button"
        className={cn("cm-group-toggle-btn", !activeTag && "active")}
        onClick={() => onChange(null)}
      >
        {t("filterAll")}
      </button>
      {tags.map((tag) => (
        <button
          key={tag.slug}
          type="button"
          className={cn(
            "cm-group-toggle-btn",
            activeTag === tag.slug && "active",
          )}
          onClick={() => onChange(activeTag === tag.slug ? null : tag.slug)}
        >
          {tag.emoji ? `${tag.emoji} ` : ""}
          {tag.label}
        </button>
      ))}
    </div>
  );
}
