"use client";

import { useTranslations } from "next-intl";
import type { MeetingSection } from "@/lib/schemas";
import { FloatingSectionNav } from "@/components/meetings/floating-section-nav";
import { PrintMinutesButton } from "@/components/meetings/print-minutes-button";
import { SectionParagraphView } from "@/components/meetings/section-paragraph-view";
import { BackToTopButton } from "@/components/ui/back-to-top-button";
import {
  cmFooterClassName,
  cmGradientClass,
  cmHeroClassName,
  cmMeetingDateClassName,
  cmMiniCardClassName,
  cmPageClassName,
  cmContentSectionsClassName,
  cmSectionBodyClassName,
  cmSectionClassName,
  cmSectionHeadClassName,
  cmWrapClassName,
} from "@/lib/colorminutes-public-styles";
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
          weekday: "short",
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      })
    : createdAtLabel;

  return (
    <div className={cn(cmPageClassName, "cm-page flex-1")} id="top">
      <div className={cmWrapClassName}>
        <section className={cmHeroClassName}>
          <h1 className="relative z-[1] m-0 text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#1f2937]">
            {title ?? untitledLabel}
          </h1>
          <p className="relative z-[1] mt-2.5 max-w-[760px] text-base text-[#6b7280]">
            {t("minutesSubtitle")}
          </p>
          {dateLabel && (
            <div className={cmMeetingDateClassName}>{dateLabel}</div>
          )}

          <div className="relative z-[1] mt-[18px] grid grid-cols-1 gap-3.5 md:grid-cols-3">
            <div className={cmMiniCardClassName}>
              <strong className="mb-1.5 block text-[0.96rem]">
                {t("mainFocusLabel")}
              </strong>
              <span className="text-[0.92rem] text-[#6b7280]">{t("mainFocus")}</span>
            </div>
            <div className={cmMiniCardClassName}>
              <strong className="mb-1.5 block text-[0.96rem]">
                {t("readingTipLabel")}
              </strong>
              <span className="text-[0.92rem] text-[#6b7280]">{t("readingTip")}</span>
            </div>
            <div className={cmMiniCardClassName}>
              <strong className="mb-1.5 block text-[0.96rem]">
                {t("goodFollowUpLabel")}
              </strong>
              <span className="text-[0.92rem] text-[#6b7280]">{t("goodFollowUp")}</span>
            </div>
          </div>

          {showPrint && (
            <div className="relative z-[1] mt-4">
              <PrintMinutesButton />
            </div>
          )}
        </section>

        <div className={cmContentSectionsClassName}>
        {sorted.map((section, index) => {
          const paragraphs = [...section.paragraphs].sort(
            (a, b) => a.sortOrder - b.sortOrder,
          );
          const headGradient = section.color;

          return (
            <section
              key={section.id}
              id={sectionAnchorId(section.id)}
              data-meeting-section
              className={cmSectionClassName}
            >
              <div
                className={cn(
                  cmSectionHeadClassName,
                  cmGradientClass(headGradient),
                )}
              >
                <h2 className="m-0 text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold text-[#1f2937]">
                  {index + 1}. {section.header}
                </h2>
              </div>
              <div className={cmSectionBodyClassName}>
                {paragraphs.map((paragraph) => (
                  <SectionParagraphView
                    key={paragraph.id}
                    paragraph={paragraph}
                  />
                ))}
              </div>
            </section>
          );
        })}
        </div>

        {createdAtLabel && (
          <footer className={cmFooterClassName}>{createdAtLabel}</footer>
        )}
      </div>

      <BackToTopButton />
      <FloatingSectionNav
        sections={sections}
        sectionAnchorId={sectionAnchorId}
      />
    </div>
  );
}
