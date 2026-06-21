"use client";

import DOMPurify from "dompurify";
import type { SectionParagraph } from "@/lib/schemas";
import { cmBoxClassName, cmGradientClass } from "@/lib/colorminutes-public-styles";
import { cn } from "@/lib/utils";

const proseClassName =
  "max-w-none [&_a]:font-semibold [&_a]:text-[#1d4ed8] [&_a]:no-underline [&_ol]:list-decimal [&_ol]:pl-[18px] [&_p]:leading-relaxed [&_p]:first:mt-2 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-[18px]";

type SectionParagraphViewProps = {
  paragraph: SectionParagraph;
};

export function SectionParagraphView({ paragraph }: SectionParagraphViewProps) {
  const sanitized = DOMPurify.sanitize(paragraph.content);

  return (
    <div
      className={cn(cmBoxClassName, cmGradientClass(paragraph.color), proseClassName)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
