"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { MeetingSection } from "@/lib/schemas";
import { FloatingSectionNav } from "@/components/meetings/floating-section-nav";
import { MinutesSearchBar } from "@/components/meetings/public/minutes-search-bar";
import { TagFilterChips } from "@/components/meetings/public/tag-filter-chips";
import { PrintMinutesButton } from "@/components/meetings/print-minutes-button";
import { SectionParagraphView } from "@/components/meetings/section-paragraph-view";
import { BackToTopButton } from "@/components/ui/back-to-top-button";
import {
  cmContentSectionsClassName,
  cmFooterClassName,
  cmGradientClass,
  cmHeroClassName,
  cmMeetingDateClassName,
  cmMiniCardClassName,
  cmPageClassName,
  cmSectionBodyClassName,
  cmSectionClassName,
  cmSectionHeadClassName,
  cmWrapClassName,
} from "@/lib/colorminutes-public-styles";
import {
  collectUniqueTags,
  sectionMatchesSearch,
  sectionMatchesTag,
} from "@/lib/minutes-filter";
import { meetingMonthChip } from "@/lib/section-colors";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...sections].sort((a, b) => a.sortOrder - b.sortOrder),
    [sections],
  );

  const tags = useMemo(() => collectUniqueTags(sorted), [sorted]);

  const visibleSections = useMemo(
    () =>
      sorted.filter(
        (section) =>
          sectionMatchesSearch(section, searchQuery) &&
          sectionMatchesTag(section, activeTag),
      ),
    [sorted, searchQuery, activeTag],
  );

  const visibleSectionIds = useMemo(
    () => new Set(visibleSections.map((section) => section.id)),
    [visibleSections],
  );

  const monthChip = meetingMonthChip(publishedAt);

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
              <span className="text-[0.92rem] text-[#6b7280]">
                {t("mainFocus")}
              </span>
            </div>
            <div className={cmMiniCardClassName}>
              <strong className="mb-1.5 block text-[0.96rem]">
                {t("readingTipLabel")}
              </strong>
              <span className="text-[0.92rem] text-[#6b7280]">
                {t("readingTip")}
              </span>
            </div>
            <div className={cmMiniCardClassName}>
              <strong className="mb-1.5 block text-[0.96rem]">
                {t("goodFollowUpLabel")}
              </strong>
              <span className="text-[0.92rem] text-[#6b7280]">
                {t("goodFollowUp")}
              </span>
            </div>
          </div>

          <MinutesSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            matchCount={visibleSections.length}
          />

          <TagFilterChips
            tags={tags}
            activeTag={activeTag}
            onChange={setActiveTag}
          />

          {showPrint && (
            <div className="relative z-[1] mt-4">
              <PrintMinutesButton />
            </div>
          )}
        </section>

        <div
          className={cn(
            cmNoResultsClassName,
            visibleSections.length === 0 && "show",
          )}
        >
          {t("noSearchResults")}
        </div>

        <div className={cmContentSectionsClassName}>
          {sorted.map((section, index) => {
            const paragraphs = [...section.paragraphs].sort(
              (a, b) => a.sortOrder - b.sortOrder,
            );
            const isVisible = visibleSectionIds.has(section.id);
            const displayIndex = visibleSections.findIndex(
              (visible) => visible.id === section.id,
            );

            return (
              <section
                key={section.id}
                id={sectionAnchorId(section.id)}
                data-meeting-section
                className={cn(
                  cmSectionClassName,
                  !isVisible && "cm-hidden-section",
                )}
              >
                <div
                  className={cn(
                    cmSectionHeadClassName,
                    cmGradientClass(section.color),
                  )}
                >
                  <h2 className="m-0 text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold text-[#1f2937]">
                    {displayIndex >= 0 ? displayIndex + 1 : index + 1}.{" "}
                    {section.header}
                    {monthChip && (
                      <span className="cm-meeting-chip">{monthChip}</span>
                    )}
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
        visibleSectionIds={visibleSectionIds}
        sectionAnchorId={sectionAnchorId}
      />
    </div>
  );
}

const cmNoResultsClassName = "cm-no-results";
