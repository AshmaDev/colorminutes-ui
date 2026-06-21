"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PublicSpaceMeeting } from "@/lib/schemas";
import {
  sectionColorAtIndex,
  sectionColorBackgroundClass,
} from "@/lib/section-colors";
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
    <ul className={cn("grid gap-4 sm:gap-6", className)}>
      {meetings.map((meeting, index) => {
        const href = `/m/${meeting.slug ?? meeting.id}`;
        const title = meeting.title ?? tm("untitled");
        const date = new Date(meeting.publishedAt ?? meeting.createdAt).toLocaleDateString(
          undefined,
          { dateStyle: "medium" },
        );
        const color = sectionColorAtIndex(index);

        return (
          <li key={meeting.id}>
            <Link
              href={href}
              className={cn(
                sectionColorBackgroundClass[color],
                "group flex items-center justify-between gap-4 rounded-3xl px-6 py-5 shadow-sm ring-1 ring-foreground/10 transition-transform hover:-translate-y-0.5 hover:shadow-md sm:px-8 sm:py-6",
              )}
            >
              <span className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                {title}
              </span>
              <span className="shrink-0 text-sm font-medium text-foreground/70">
                {date}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
