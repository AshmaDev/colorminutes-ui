"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type MinutesSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  matchCount?: number;
  className?: string;
};

export function MinutesSearchBar({
  value,
  onChange,
  matchCount,
  className,
}: MinutesSearchBarProps) {
  const t = useTranslations("meetings");

  return (
    <div className={cn("cm-search-wrap", className)}>
      <div className="cm-search-field">
        <span className="cm-search-icon" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          className="cm-search-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("searchPlaceholder")}
          autoComplete="off"
          aria-label={t("searchPlaceholder")}
        />
        <button
          type="button"
          className={cn("cm-search-clear no-print", value && "visible")}
          onClick={() => onChange("")}
          title={t("searchClear")}
          aria-label={t("searchClear")}
        >
          ✕
        </button>
      </div>
      <div className="cm-search-results-info" aria-live="polite">
        {value.trim() && matchCount !== undefined
          ? t("searchMatchCount", { count: matchCount })
          : ""}
      </div>
    </div>
  );
}
