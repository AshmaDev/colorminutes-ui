"use client";

import { useTranslations } from "next-intl";
import { landingButtonSecondaryClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

export function PrintMinutesButton() {
  const t = useTranslations("meetings");

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn(
        "no-print inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors",
        landingButtonSecondaryClassName,
      )}
    >
      {t("printMinutes")}
    </button>
  );
}
