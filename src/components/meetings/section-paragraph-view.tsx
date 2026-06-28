"use client";

import DOMPurify from "dompurify";
import type { SectionParagraph } from "@/lib/schemas";
import { cmBoxClassName, cmGradientClass } from "@/lib/colorminutes-public-styles";
import { cn } from "@/lib/utils";

const proseClassName =
  "max-w-none [&_a]:font-semibold [&_a]:text-[#1d4ed8] [&_a]:no-underline [&_h3]:mb-2 [&_h3]:mt-0 [&_h3]:text-base [&_ol]:list-decimal [&_ol]:pl-[18px] [&_p]:leading-relaxed [&_p]:text-[0.97rem] [&_p]:text-[#243042] [&_p]:first:mt-2 [&_strong]:font-bold [&_ul.clean]:mt-2 [&_ul.clean]:list-disc [&_ul.clean]:pl-[18px] [&_ul.clean_li]:text-[0.97rem] [&_ul.clean_li]:text-[#243042] [&_ul]:list-disc [&_ul]:pl-[18px]";

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
