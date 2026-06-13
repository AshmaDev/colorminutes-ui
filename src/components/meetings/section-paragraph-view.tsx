"use client";

import DOMPurify from "dompurify";
import type { SectionParagraph } from "@/lib/schemas";
import { paragraphVariantBlockClass } from "@/lib/paragraph-variants";
import { cn } from "@/lib/utils";

const proseClassName =
  "prose prose-lg max-w-none text-foreground/90 [&_a]:text-foreground [&_a]:underline [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:pl-6 [&_ul]:pl-6 [&_p]:leading-relaxed";

type SectionParagraphViewProps = {
  paragraph: SectionParagraph;
};

export function SectionParagraphView({ paragraph }: SectionParagraphViewProps) {
  const sanitized = DOMPurify.sanitize(paragraph.content);
  const isNormal = paragraph.variant === "normal";

  if (isNormal) {
    return (
      <div
        className={proseClassName}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  return (
    <div
      className={cn(
        paragraphVariantBlockClass[paragraph.variant],
        proseClassName,
        "prose-sm sm:prose-base",
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
