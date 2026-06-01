import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomeHeroActions } from "@/components/home/home-hero-actions";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <section className="relative flex flex-1 items-center overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-white to-brand-cream/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 top-1/4 size-72 rounded-full bg-primary/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-16 bottom-1/4 size-64 rounded-full bg-brand-pink/20 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-sm font-medium text-foreground">
                <span className="size-2 rounded-full bg-primary" />
                {t("badge")}
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t("headline")}{" "}
                <span className="bg-gradient-to-r from-brand-peach via-brand-lilac to-brand-sage bg-clip-text text-transparent">
                  {t("headlineHighlight")}
                </span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                {t("description")}
              </p>
              <HomeHeroActions />
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-lg shadow-primary/10">
                <div className="mb-4 flex gap-2">
                  <span className="h-2 flex-1 rounded-full bg-brand-peach/50" />
                  <span className="h-2 flex-1 rounded-full bg-brand-pink/50" />
                  <span className="h-2 flex-1 rounded-full bg-brand-lilac/50" />
                  <span className="h-2 flex-1 rounded-full bg-brand-sage/50" />
                  <span className="h-2 flex-1 rounded-full bg-primary/50" />
                </div>
                <div className="space-y-3 rounded-xl bg-muted/40 p-4">
                  <p className="text-sm font-medium text-foreground">
                    {t("previewTitle")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-brand-peach">{t("previewVote")}</span>{" "}
                    {t("previewVoteText")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-brand-sage">{t("previewAction")}</span>{" "}
                    {t("previewActionText")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-brand-lilac">{t("previewNote")}</span>{" "}
                    {t("previewNoteText")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
