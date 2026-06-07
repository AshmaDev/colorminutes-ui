import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HomeSectionLabel } from "@/components/home/home-section-label";
import { HomeSectionTitle } from "@/components/home/home-section-title";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { landingButtonSecondaryClassName, landingSectionClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

const tiers = ["free", "pro", "team"] as const;

export async function HomePricing() {
  const t = await getTranslations("home.pricing");

  return (
    <section id="pricing" className={cn(landingSectionClassName, "bg-brand-pink")}>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="mb-16 max-w-2xl space-y-4">
          <HomeSectionLabel>{t("label")}</HomeSectionLabel>
          <HomeSectionTitle>{t("title")}</HomeSectionTitle>
          <p className="text-base leading-relaxed text-foreground/80">{t("subtitle")}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {tiers.map((tier) => {
            const isHighlighted = tier === "pro";
            const features = t.raw(`${tier}.features`) as string[];

            return (
              <GlassCard
                key={tier}
                highlighted={isHighlighted}
                className="flex flex-col"
              >
                {isHighlighted && (
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em]">
                    {t("pro.highlight")}
                  </p>
                )}
                <h3 className="font-heading text-3xl font-semibold text-foreground">
                  {t(`${tier}.name`)}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-heading text-5xl font-semibold text-foreground">
                    {t(`${tier}.price`)}
                  </span>
                  <span className="text-sm text-foreground/70">{t(`${tier}.period`)}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                  {t(`${tier}.description`)}
                </p>

                <ul className="my-8 flex-1 space-y-3 pt-2">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm leading-relaxed text-foreground/80 before:mr-2 before:content-['—']"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  render={<Link href="/register" />}
                  variant="landing"
                  size="lg"
                  className={cn(
                    "w-full sm:w-auto",
                    !isHighlighted && landingButtonSecondaryClassName,
                  )}
                >
                  {t(`${tier}.cta`)}
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
