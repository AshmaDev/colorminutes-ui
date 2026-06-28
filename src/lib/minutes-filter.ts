import type { MeetingSection, SectionTag } from "@/lib/schemas";

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sectionSearchText(section: MeetingSection): string {
  return [
    section.header,
    section.navLabel ?? "",
    ...section.paragraphs.map((paragraph) => stripHtml(paragraph.content)),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function sectionMatchesSearch(
  section: MeetingSection,
  query: string,
): boolean {
  if (!query.trim()) {
    return true;
  }

  return sectionSearchText(section).includes(query.trim().toLowerCase());
}

export function sectionMatchesTag(
  section: MeetingSection,
  tagSlug: string | null,
): boolean {
  if (!tagSlug) {
    return true;
  }

  return section.tag?.slug === tagSlug;
}

export function collectUniqueTags(sections: MeetingSection[]): SectionTag[] {
  const seen = new Set<string>();
  const tags: SectionTag[] = [];

  for (const section of sections) {
    if (!section.tag || seen.has(section.tag.slug)) {
      continue;
    }
    seen.add(section.tag.slug);
    tags.push(section.tag);
  }

  return tags;
}

export function collectTagsFromMeetings(
  meetings: { tags: SectionTag[] }[],
): SectionTag[] {
  const seen = new Set<string>();
  const tags: SectionTag[] = [];

  for (const meeting of meetings) {
    for (const tag of meeting.tags) {
      if (seen.has(tag.slug)) {
        continue;
      }
      seen.add(tag.slug);
      tags.push(tag);
    }
  }

  return tags;
}

export function meetingMatchesSearch(
  meeting: { searchText: string; title: string | null },
  query: string,
): boolean {
  if (!query.trim()) {
    return true;
  }

  const lower = query.trim().toLowerCase();
  return (
    meeting.searchText.includes(lower) ||
    (meeting.title?.toLowerCase().includes(lower) ?? false)
  );
}

export function meetingMatchesTag(
  meeting: { tags: SectionTag[] },
  tagSlug: string | null,
): boolean {
  if (!tagSlug) {
    return true;
  }

  return meeting.tags.some((tag) => tag.slug === tagSlug);
}
