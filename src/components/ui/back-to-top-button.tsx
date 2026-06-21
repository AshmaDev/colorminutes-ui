"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type BackToTopButtonProps = {
  className?: string;
};

export function BackToTopButton({ className }: BackToTopButtonProps) {
  const t = useTranslations("meetings");

  return (
    <a
      href="#top"
      aria-label={t("backToTop")}
      className={cn("cm-top-link no-print", className)}
    >
      {t("backToTop")}
    </a>
  );
}
