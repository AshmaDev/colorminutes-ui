"use client";

import { useTranslations } from "next-intl";
import type { MeetingSection } from "@/lib/schemas";
import { shortSectionLabel } from "@/lib/section-colors";

type FloatingSectionNavProps = {
  sections: MeetingSection[];
  sectionAnchorId: (sectionId: string) => string;
};

export function FloatingSectionNav({
  sections,
  sectionAnchorId,
}: FloatingSectionNavProps) {
  const t = useTranslations("meetings");
  const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <nav aria-label={t("sectionNavigation")} className="cm-float-nav no-print">
      {sorted.map((section) => (
        <a key={section.id} href={`#${sectionAnchorId(section.id)}`}>
          {shortSectionLabel(section.header, 20)}
        </a>
      ))}
    </nav>
  );
}
