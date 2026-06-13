export function isMeetingPublished(meeting: {
  publishedAt: string | null;
}): boolean {
  return meeting.publishedAt != null;
}

export type PublishStatusKey = "published" | "unpublished";

export function getPublishStatusKey(meeting: {
  publishedAt: string | null;
}): PublishStatusKey {
  return isMeetingPublished(meeting) ? "published" : "unpublished";
}
