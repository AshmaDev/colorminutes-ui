import { getTranslations } from "next-intl/server";
import { HomeSectionLabel } from "@/components/home/home-section-label";
import { HomeSectionTitle } from "@/components/home/home-section-title";
import { landingSurfaceClassName } from "@/lib/landing-styles";
import { ClickIcon, PdfIcon, RecordIcon, UploadIcon } from "../icons";

const options = [
  { key: "transcription" as const, icon: UploadIcon },
  { key: "recording" as const, icon: RecordIcon },
  { key: "ocr" as const, icon: PdfIcon },
];

export async function HomeOptions() {
  const t = await getTranslations("home.options");

  return (
    <section className="flex min-h-screen flex-col justify-center border-b border-black bg-brand-yellow">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="mb-16 max-w-2xl space-y-4">
          <HomeSectionLabel>{t("label")}</HomeSectionLabel>
          <HomeSectionTitle>{t("title")}</HomeSectionTitle>
        </div>

        <div className={`grid lg:grid-cols-3 ${landingSurfaceClassName}`}>
          {options.map(({ key, icon: Icon }, index) => (
            <article
              key={key}
              className={`group flex flex-col justify-between p-8 sm:p-10 ${index < options.length - 1 ? "border-b border-black lg:border-b-0 lg:border-r" : ""
                }`}
            >
              <div className="space-y-8">
                <div className="flex items-start justify-between">
                  <span className="font-heading text-5xl font-semibold leading-none text-foreground sm:text-6xl">
                    {t(`${key}.number`)}
                  </span>
                  <Icon className="size-12 text-foreground" aria-hidden />
                </div>
                <div className="space-y-3">
                  <h3 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
              <ClickIcon
                className="mt-10 size-12 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
