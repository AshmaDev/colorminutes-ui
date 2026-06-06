import type { Meeting, MeetingVisibility } from "@/lib/schemas";

export function isMeetingPublished(meeting: {
  visibility: MeetingVisibility;
  publishedAt: string | null;
}): boolean {
  return meeting.publishedAt != null && meeting.visibility !== "draft";
}

export type PublishStatusKey = "published" | "unpublished";

export function getPublishStatusKey(meeting: {
  visibility: MeetingVisibility;
  publishedAt: string | null;
}): PublishStatusKey {
  return isMeetingPublished(meeting) ? "published" : "unpublished";
}
