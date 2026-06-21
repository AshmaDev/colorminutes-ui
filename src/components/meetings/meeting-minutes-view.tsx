"use client";

import { useTranslations } from "next-intl";
import type { MeetingSection } from "@/lib/schemas";
import { FloatingSectionNav } from "@/components/meetings/floating-section-nav";
import { PrintMinutesButton } from "@/components/meetings/print-minutes-button";
import { SectionParagraphView } from "@/components/meetings/section-paragraph-view";
import { BackToTopButton } from "@/components/ui/back-to-top-button";
import { sectionColorBackgroundClass } from "@/lib/section-colors";
import { cn } from "@/lib/utils";

type MeetingMinutesViewProps = {
  title: string | null;
  sections: MeetingSection[];
  untitledLabel: string;
  createdAtLabel?: string;
  publishedAt?: string | null;
  showPrint?: boolean;
};

export function sectionAnchorId(sectionId: string): string {
  return `section-${sectionId}`;
}

export function MeetingMinutesView({
  title,
  sections,
  untitledLabel,
  createdAtLabel,
  publishedAt,
  showPrint = true,
}: MeetingMinutesViewProps) {
  const t = useTranslations("meetings");
  const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);

  const dateLabel = publishedAt
    ? t("publishedOn", {
        date: new Date(publishedAt).toLocaleDateString(undefined, {
          dateStyle: "long",
        }),
      })
    : createdAtLabel;

  return (
    <>
      <header className="bg-brand-sky px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            {title ?? untitledLabel}
          </h1>
          {dateLabel && (
            <p className="text-sm font-medium uppercase tracking-wider text-foreground/70">
              {dateLabel}
            </p>
          )}
          {sorted.length > 0 && (
            <p className="mx-auto max-w-xl rounded-2xl bg-white/50 px-5 py-4 text-sm leading-relaxed text-foreground/80">
              <span className="font-medium text-foreground">{t("readingTipLabel")}</span>{" "}
              {t("readingTip")}
            </p>
          )}
          {showPrint && (
            <div className="pt-2">
              <PrintMinutesButton />
            </div>
          )}
        </div>
      </header>

      {sorted.map((section, index) => {
        const paragraphs = [...section.paragraphs].sort(
          (a, b) => a.sortOrder - b.sortOrder,
        );

        return (
          <section
            key={section.id}
            id={sectionAnchorId(section.id)}
            data-meeting-section
            className={cn(
              sectionColorBackgroundClass[section.color],
              "scroll-mt-24 px-6 py-16 sm:py-20",
            )}
          >
            <div className="mx-auto max-w-3xl space-y-6">
              <h2 className="font-heading text-3xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl">
                {index + 1}. {section.header}
              </h2>
              <div className="space-y-4">
                {paragraphs.map((paragraph) => (
                  <SectionParagraphView
                    key={paragraph.id}
                    paragraph={paragraph}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {createdAtLabel && sorted.length > 0 && (
        <footer className="border-t border-foreground/10 bg-white/60 px-6 py-8">
          <div className="mx-auto max-w-3xl text-sm text-foreground/60">
            {createdAtLabel}
          </div>
        </footer>
      )}

      <div className="no-print fixed bottom-6 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-8 sm:right-6">
        <BackToTopButton inline />
        <FloatingSectionNav
          sections={sections}
          sectionAnchorId={sectionAnchorId}
        />
      </div>
    </>
  );
}
