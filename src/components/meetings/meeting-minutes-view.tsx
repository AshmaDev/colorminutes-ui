"use client";

import DOMPurify from "dompurify";
import { useTranslations } from "next-intl";
import type { MeetingSection } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { sectionColorTextClass } from "@/lib/section-colors";

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:gap-16">
      <aside className="hidden shrink-0 lg:block lg:w-52 xl:w-56">
        <nav
          aria-label={t("tableOfContents")}
          className="sticky top-8 space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("tableOfContents")}
          </p>
          <ul className="space-y-1 border-l border-border/60 pl-4">
            {sorted.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${sectionAnchorId(section.id)}`}
                  className={cn(
                    "block py-1.5 text-sm leading-snug transition-colors hover:underline",
                    sectionColorTextClass[section.color]
                  )}
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
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {title ?? untitledLabel}
          </h1>
        </header>

        <div className="space-y-20">
          {sorted.map((section) => (
            <section
              key={section.id}
              id={sectionAnchorId(section.id)}
              className="scroll-mt-8 border-t border-border/50 pt-12 first:border-t-0 first:pt-0"
            >
              <h2
                className={`mb-6 text-3xl font-bold leading-snug tracking-tight sm:text-4xl ${sectionColorTextClass[section.color]}`}
              >
                {section.header}
              </h2>
              <div
                className="prose prose-lg max-w-none text-foreground/90 [&_a]:text-primary [&_a]:underline [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:pl-6 [&_ul]:pl-6 [&_p]:leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(section.content),
                }}
              />
            </section>
          ))}
        </div>

        {createdAtLabel && (
          <footer className="mt-20 border-t border-border/50 pt-8 text-left text-sm text-muted-foreground">
            {createdAtLabel}
          </footer>
        )}
      </article>
    </div>
  );
}
