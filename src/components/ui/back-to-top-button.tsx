"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type BackToTopButtonProps = {
  className?: string;
  threshold?: number;
  inline?: boolean;
};

export function BackToTopButton({
  className,
  threshold = 400,
  inline = false,
}: BackToTopButtonProps) {
  const t = useTranslations("meetings");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={t("backToTop")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "no-print rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-foreground shadow-md ring-1 ring-foreground/10 backdrop-blur-sm transition-opacity hover:bg-white",
        inline
          ? "static"
          : "fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-50 sm:bottom-[calc(2rem+env(safe-area-inset-bottom))] sm:right-[calc(1.5rem+env(safe-area-inset-right))]",
        className,
      )}
    >
      {t("backToTop")}
    </button>
  );
}
