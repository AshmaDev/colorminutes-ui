"use client";

import { useTranslations } from "next-intl";
import type { MeetingSection } from "@/lib/schemas";
import { SectionParagraphView } from "@/components/meetings/section-paragraph-view";
import { glassEffectClassName } from "@/lib/landing-styles";
import { sectionColorBarClass } from "@/lib/section-colors";
import { cn } from "@/lib/utils";

type MeetingMinutesViewProps = {
  title: string | null;
  sections: MeetingSection[];
  untitledLabel: string;
  createdAtLabel?: string;
};

function sectionAnchorId(sectionId: string): string {
  return `section-${sectionId}`;
}

export function MeetingMinutesView({
  title,
  sections,
  untitledLabel,
  createdAtLabel,
}: MeetingMinutesViewProps) {
  const t = useTranslations("meetings");
  const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className={cn(glassEffectClassName, "p-6 sm:p-10")}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:gap-16">
      <aside className="hidden shrink-0 lg:block lg:w-52 xl:w-56">
        <nav
          aria-label={t("tableOfContents")}
          className="sticky top-8 space-y-4"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/70">
            {t("tableOfContents")}
          </p>
          <ul className="space-y-1 border-l border-foreground/10 pl-4">
            {sorted.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${sectionAnchorId(section.id)}`}
                  className="block py-1.5 text-sm leading-snug text-foreground transition-colors hover:underline"
                >
                  {section.header}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <article className="min-w-0 flex-1 lg:max-w-2xl">
        <header className="mb-16 text-center">
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            {title ?? untitledLabel}
          </h1>
        </header>

        <div className="space-y-20">
          {sorted.map((section) => {
            const paragraphs = [...section.paragraphs].sort(
              (a, b) => a.sortOrder - b.sortOrder,
            );

            return (
              <section
                key={section.id}
                id={sectionAnchorId(section.id)}
                className="scroll-mt-8 border-t border-foreground/10 pt-12 first:border-t-0 first:pt-0"
              >
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className={cn(
                      "h-10 w-1 shrink-0 rounded-full",
                      sectionColorBarClass[section.color],
                    )}
                    aria-hidden
                  />
                  <h2 className="font-heading text-3xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl">
                    {section.header}
                  </h2>
                </div>
                <div className="space-y-4">
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
          <footer className="mt-20 border-t border-foreground/10 pt-8 text-left text-sm text-foreground/60">
            {createdAtLabel}
          </footer>
        )}
      </article>
      </div>
    </div>
  );
}
