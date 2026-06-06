"use client";

import { useTranslations } from "next-intl";

export function SiteFooter({ variant = "default" }: { variant?: "default" | "landing" }) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  const isLanding = variant === "landing";

  return (
    <footer
      className={
        isLanding
          ? "mt-auto bg-white/40 backdrop-blur-sm"
          : "mt-auto border-t border-border/60 bg-muted"
      }
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center px-6">
        <p className={isLanding ? "text-xs uppercase tracking-wider text-foreground/70" : "text-sm text-muted-foreground"}>
          {t("copyright", { year })}
        </p>
      </div>
    </footer>
  );
}
