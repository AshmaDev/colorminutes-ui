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

export const sectionColorBackgroundClass: Record<SectionColor, string> = {
  peach: "bg-brand-peach",
  pink: "bg-brand-pink",
  lilac: "bg-brand-lilac",
  sage: "bg-brand-sage",
};

export const sectionColorNavButtonClass: Record<SectionColor, string> = {
  peach:
    "bg-brand-peach/90 text-foreground shadow-sm hover:bg-brand-peach ring-1 ring-foreground/10",
  pink: "bg-brand-pink/90 text-foreground shadow-sm hover:bg-brand-pink ring-1 ring-foreground/10",
  lilac:
    "bg-brand-lilac/90 text-foreground shadow-sm hover:bg-brand-lilac ring-1 ring-foreground/10",
  sage: "bg-brand-sage/90 text-foreground shadow-sm hover:bg-brand-sage ring-1 ring-foreground/10",
};

export const sectionColorNavButtonActiveClass: Record<SectionColor, string> = {
  peach: "bg-brand-peach ring-2 ring-foreground/30",
  pink: "bg-brand-pink ring-2 ring-foreground/30",
  lilac: "bg-brand-lilac ring-2 ring-foreground/30",
  sage: "bg-brand-sage ring-2 ring-foreground/30",
};

export function shortSectionLabel(header: string, maxLen = 22): string {
  const trimmed = header.trim();
  if (trimmed.length <= maxLen) {
    return trimmed;
  }

  const words = trimmed.split(/\s+/);
  let label = words[0] ?? trimmed;
  for (let i = 1; i < words.length; i++) {
    const next = `${label} ${words[i]}`;
    if (next.length > maxLen) {
      break;
    }
    label = next;
  }

  if (label.length < trimmed.length && label.length < maxLen - 1) {
    return `${label}…`;
  }

  return `${label.slice(0, maxLen - 1)}…`;
}
