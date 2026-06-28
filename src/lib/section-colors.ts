import type { SectionColor } from "@/lib/schemas";

/** Section header cycle on colorminutes.com */
export const SECTION_COLORS: SectionColor[] = [
  "blue",
  "teal",
  "green",
  "pink",
  "purple",
  "gold",
  "orange",
  "red",
];

/** Inner box cycle after the first paragraph (matches colorminutes.com) */
export const BOX_COLOR_CYCLE: SectionColor[] = [
  "blue",
  "gold",
  "orange",
  "teal",
  "green",
  "red",
  "purple",
  "pink",
];

export function sectionColorAtIndex(index: number): SectionColor {
  return SECTION_COLORS[index % SECTION_COLORS.length]!;
}

export function paragraphColor(
  sectionColor: SectionColor,
  sectionIndex: number,
  paragraphIndex: number,
): SectionColor {
  if (paragraphIndex === 0) {
    return sectionColor;
  }
  return BOX_COLOR_CYCLE[(sectionIndex + paragraphIndex - 1) % BOX_COLOR_CYCLE.length]!;
}

export const sectionColorBarClass: Record<SectionColor, string> = {
  blue: "cm-gradient-blue",
  green: "cm-gradient-green",
  gold: "cm-gradient-gold",
  pink: "cm-gradient-pink",
  purple: "cm-gradient-purple",
  teal: "cm-gradient-teal",
  orange: "cm-gradient-orange",
  red: "cm-gradient-red",
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

export function navLabelFromHeader(header: string, maxWords = 3): string {
  const words = header.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, maxWords).join(" ");
}

export function sectionNavLabel(
  section: { header: string; navLabel: string | null },
): string {
  return section.navLabel?.trim() || navLabelFromHeader(section.header);
}

export function meetingMonthChip(date: string | null | undefined): string | null {
  if (!date) {
    return null;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}
