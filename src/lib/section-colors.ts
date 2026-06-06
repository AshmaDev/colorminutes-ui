import type { SectionColor } from "@/lib/schemas";

export const SECTION_COLORS: SectionColor[] = ["peach", "pink", "lilac", "sage"];

export function sectionColorAtIndex(index: number): SectionColor {
  return SECTION_COLORS[index % SECTION_COLORS.length]!;
}

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
