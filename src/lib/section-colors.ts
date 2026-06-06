import type { SectionColor } from "@/lib/schemas";

export const sectionColorTextClass: Record<SectionColor, string> = {
  peach: "text-brand-peach",
  pink: "text-brand-pink",
  lilac: "text-brand-lilac",
  sage: "text-brand-sage",
};

export const sectionColorBarClass: Record<SectionColor, string> = {
  peach: "bg-brand-peach/50",
  pink: "bg-brand-pink/50",
  lilac: "bg-brand-lilac/50",
  sage: "bg-brand-sage/50",
};
