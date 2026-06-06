import { getTranslations } from "next-intl/server";
import { HomeSectionLabel } from "@/components/home/home-section-label";
import { HomeSectionTitle } from "@/components/home/home-section-title";
import { landingCardClassName, landingSectionClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";
import { ClickIcon, DownloadIcon, GlobeIcon, LockIcon } from "../icons";

const items = [
  { key: "publish" as const, icon: GlobeIcon },
  { key: "download" as const, icon: DownloadIcon },
];

export async function HomePublish() {
  const t = await getTranslations("home.publish");

  return (
    <section className={cn(landingSectionClassName, "bg-brand-peach")}>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div className="space-y-4">
            <HomeSectionLabel>{t("label")}</HomeSectionLabel>
            <HomeSectionTitle>{t("title")}</HomeSectionTitle>
          </div>
          <p className="max-w-md text-base leading-relaxed text-foreground/80 lg:justify-self-end">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {items.map(({ key, icon: Icon }) => (
            <article key={key} className={cn(landingCardClassName, "group sm:p-12")}>
              <div className="mb-8 flex items-start justify-between">
                <Icon className="size-12 text-foreground" aria-hidden />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-foreground shadow-sm">
                  <LockIcon className="size-5 text-foreground/70" aria-hidden />
                  {t(`${key}.secure`)}
                </span>
              </div>
              <h3 className="mb-4 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                {t(`${key}.title`)}
              </h3>
              <p className="mb-8 max-w-sm text-sm leading-relaxed text-foreground/80 sm:text-base">
                {t(`${key}.description`)}
              </p>
              <ClickIcon
                className="size-12 text-foreground opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
