"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PublicSpaceMeeting } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type SpaceMeetingListProps = {
  meetings: PublicSpaceMeeting[];
  className?: string;
};

export function SpaceMeetingList({ meetings, className }: SpaceMeetingListProps) {
  const t = useTranslations("spaces");
  const tm = useTranslations("meetings");

  if (meetings.length === 0) {
    return (
      <p className={cn("text-sm text-foreground/70", className)}>
        {t("noMeetings")}
      </p>
    );
  }

  return (
    <ul className={cn("divide-y divide-foreground/10 rounded-2xl border border-foreground/10", className)}>
      {meetings.map((meeting) => {
        const href = `/m/${meeting.slug ?? meeting.id}`;
        const title = meeting.title ?? tm("untitled");
        const date = new Date(meeting.publishedAt ?? meeting.createdAt).toLocaleDateString(
          undefined,
          { dateStyle: "medium" }
        );

        return (
          <li key={meeting.id}>
            <Link
              href={href}
              className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-foreground/[0.03] sm:px-6"
            >
              <span className="font-medium text-foreground">{title}</span>
              <span className="shrink-0 text-sm text-foreground/60">{date}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
