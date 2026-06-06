"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { HomeSectionLabel } from "@/components/home/home-section-label";
import { HomeSectionTitle } from "@/components/home/home-section-title";
import { landingSurfaceClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

const faqKeys = ["security", "formats", "ocr", "publish", "colors", "cancel"] as const;

export function HomeFaq() {
  const t = useTranslations("home.faq");
  const [openKey, setOpenKey] = useState<string | null>("security");

  return (
    <section id="faq" className="flex min-h-screen flex-col justify-center border-b border-black bg-brand-lilac">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="mb-16 max-w-2xl space-y-4">
          <HomeSectionLabel>{t("label")}</HomeSectionLabel>
          <HomeSectionTitle>{t("title")}</HomeSectionTitle>
        </div>

        <div className={landingSurfaceClassName}>
          {faqKeys.map((key, index) => {
            const isOpen = openKey === key;

            return (
              <div
                key={key}
                className={cn(index < faqKeys.length - 1 && "border-b border-black")}
              >
                <button
                  type="button"
                  onClick={() => setOpenKey(isOpen ? null : key)}
                  className="flex w-full items-start justify-between gap-6 px-6 py-6 text-left sm:px-8 sm:py-8"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                    {t(`items.${key}.question`)}
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-1 size-5 shrink-0 text-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-black px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
                    <p className="max-w-3xl text-sm leading-relaxed text-foreground/80 sm:text-base">
                      {t(`items.${key}.answer`)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
