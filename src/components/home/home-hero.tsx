import { getTranslations } from "next-intl/server";
import { HomeHeroActions } from "@/components/home/home-hero-actions";
import { HomeSectionLabel } from "@/components/home/home-section-label";
import { HomeSectionTitle } from "@/components/home/home-section-title";

export async function HomeHero() {
  const t = await getTranslations("home");

  return (
    <section className="flex min-h-screen flex-col justify-center border-b border-black bg-brand-sky">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
        <div className="space-y-8">
          <HomeSectionLabel>{t("badge")}</HomeSectionLabel>
          <HomeSectionTitle as="h1">
            {t("headline")}{" "}
            <span className="italic">{t("headlineHighlight")}</span>
          </HomeSectionTitle>
          <p className="max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            {t("description")}
          </p>
          <HomeHeroActions />
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="border border-black bg-white p-6 sm:p-8">
            <div className="mb-6 flex gap-2 border-b border-black pb-4">
              <span className="h-2 flex-1 bg-brand-peach" />
              <span className="h-2 flex-1 bg-brand-pink" />
              <span className="h-2 flex-1 bg-brand-lilac" />
              <span className="h-2 flex-1 bg-brand-sage" />
              <span className="h-2 flex-1 bg-primary" />
            </div>
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.15em]">
                {t("previewTitle")}
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">
                <span className="font-semibold text-foreground">{t("previewVote")}</span>{" "}
                {t("previewVoteText")}
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">
                <span className="font-semibold text-foreground">{t("previewAction")}</span>{" "}
                {t("previewActionText")}
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">
                <span className="font-semibold text-foreground">{t("previewNote")}</span>{" "}
                {t("previewNoteText")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
