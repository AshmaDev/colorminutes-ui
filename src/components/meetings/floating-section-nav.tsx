"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { MeetingSection } from "@/lib/schemas";
import {
  sectionColorNavButtonActiveClass,
  sectionColorNavButtonClass,
  shortSectionLabel,
} from "@/lib/section-colors";
import { cn } from "@/lib/utils";

type FloatingSectionNavProps = {
  sections: MeetingSection[];
  sectionAnchorId: (sectionId: string) => string;
};

export function FloatingSectionNav({
  sections,
  sectionAnchorId,
}: FloatingSectionNavProps) {
  const t = useTranslations("meetings");
  const [activeId, setActiveId] = useState<string | null>(null);
  const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);

  useEffect(() => {
    if (sections.length === 0) {
      return;
    }

    const ordered = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const section of ordered) {
      const element = document.getElementById(sectionAnchorId(section.id));
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [sections, sectionAnchorId]);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={t("sectionNavigation")}
      className="flex max-h-[min(60vh,24rem)] flex-col items-end gap-1.5 overflow-y-auto sm:gap-2"
    >
      {sorted.map((section) => {
        const anchorId = sectionAnchorId(section.id);
        const isActive = activeId === anchorId;

        return (
          <a
            key={section.id}
            href={`#${anchorId}`}
            className={cn(
              "inline-flex max-w-[10.5rem] items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:max-w-[12rem] sm:px-4 sm:py-2 sm:text-sm",
              isActive
                ? sectionColorNavButtonActiveClass[section.color]
                : sectionColorNavButtonClass[section.color],
            )}
          >
            <span className="truncate">{shortSectionLabel(section.header)}</span>
          </a>
        );
      })}
    </nav>
  );
}
