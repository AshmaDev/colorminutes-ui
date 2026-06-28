"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { MeetingSection } from "@/lib/schemas";
import { sectionNavLabel } from "@/lib/section-colors";

type FloatingSectionNavProps = {
  sections: MeetingSection[];
  visibleSectionIds: Set<string>;
  sectionAnchorId: (sectionId: string) => string;
};

const MANY_LINKS_THRESHOLD = 4;

export function FloatingSectionNav({
  sections,
  visibleSectionIds,
  sectionAnchorId,
}: FloatingSectionNavProps) {
  const t = useTranslations("meetings");
  const [expanded, setExpanded] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);
  const [currentTarget, setCurrentTarget] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const sorted = useMemo(
    () =>
      [...sections]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .filter((section) => visibleSectionIds.has(section.id)),
    [sections, visibleSectionIds],
  );

  const manyLinks = sorted.length > MANY_LINKS_THRESHOLD;

  const handleLinkClick = useCallback(
    (label: string, href: string) => {
      if (!manyLinks) {
        return;
      }
      setExpanded(false);
      setCurrentLabel(label);
      setCurrentTarget(href);
    },
    [manyLinks],
  );

  useEffect(() => {
    if (!manyLinks) {
      return;
    }

    const onDocumentClick = (event: MouseEvent) => {
      if (!expanded || !navRef.current) {
        return;
      }
      const target = event.target as Node;
      if (navRef.current.contains(target)) {
        return;
      }
      setExpanded(false);
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [expanded, manyLinks]);

  useEffect(() => {
    if (!manyLinks || !currentTarget) {
      return;
    }

    const onScroll = () => {
      const scrollPos = window.scrollY + 120;
      let current: MeetingSection | null = null;

      for (const section of sorted) {
        const element = document.getElementById(sectionAnchorId(section.id));
        if (element && element.offsetTop <= scrollPos) {
          current = section;
        }
      }

      if (current) {
        setCurrentLabel(sectionNavLabel(current));
        setCurrentTarget(`#${sectionAnchorId(current.id)}`);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [manyLinks, currentTarget, sorted, sectionAnchorId]);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <>
      <nav
        ref={navRef}
        aria-label={t("sectionNavigation")}
        className={`cm-float-nav no-print${manyLinks ? " many-links" : ""}${
          expanded ? " expanded" : ""
        }`}
      >
        {sorted.map((section) => {
          const href = `#${sectionAnchorId(section.id)}`;
          const label = sectionNavLabel(section);

          return (
            <a
              key={section.id}
              href={href}
              onClick={() => handleLinkClick(label, href)}
            >
              {label}
            </a>
          );
        })}
      </nav>

      {manyLinks && (
        <div className="cm-compact-nav-row many-links no-print">
          <button
            type="button"
            className="cm-subjects-btn"
            onClick={() => setExpanded(true)}
          >
            {t("subjectsButton")}
          </button>
          {currentLabel && currentTarget && (
            <button
              type="button"
              className="cm-current-section-btn show"
              onClick={() => {
                document
                  .querySelector(currentTarget)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {currentLabel}
            </button>
          )}
        </div>
      )}
    </>
  );
}
