"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PublicSpaceMeeting } from "@/lib/schemas";
import {
  cmContentSectionsClassName,
  cmGradientClass,
  cmMeetingDateClassName,
  cmSectionBodyClassName,
  cmSectionClassName,
  cmSectionHeadClassName,
} from "@/lib/colorminutes-public-styles";
import { sectionColorAtIndex } from "@/lib/section-colors";
import { cn } from "@/lib/utils";

type SpaceMeetingListProps = {
  meetings: PublicSpaceMeeting[];
  emptyMessage?: string;
  className?: string;
};

export function SpaceMeetingList({
  meetings,
  emptyMessage,
  className,
}: SpaceMeetingListProps) {
  const t = useTranslations("spaces");
  const tm = useTranslations("meetings");

  if (meetings.length === 0) {
    return (
      <p className={cn("cm-no-results show text-sm text-[#6b7280]", className)}>
        {emptyMessage ?? t("noMeetings")}
      </p>
    );
  }

  return (
    <ul className={cn(cmContentSectionsClassName, className)}>
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
            <article className={cmSectionClassName}>
              <div className={cn(cmSectionHeadClassName, cmGradientClass(color))}>
                <h2 className="m-0 text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold text-[#1f2937]">
                  {title}
                </h2>
              </div>
              <div className={cn(cmSectionBodyClassName, "space-y-3")}>
                <div className={cn(cmMeetingDateClassName, "mt-0")}>{date}</div>

                {meeting.description && (
                  <p className="m-0 line-clamp-3 text-[0.97rem] leading-relaxed text-[#374151]">
                    {meeting.description}
                  </p>
                )}

                {meeting.tags.length > 0 && (
                  <div className="cm-badge-row !mt-0">
                    {meeting.tags.map((tag) => (
                      <span key={tag.slug} className="cm-badge">
                        {tag.emoji ? `${tag.emoji} ` : ""}
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1d4ed8] no-underline transition-opacity hover:opacity-80"
                >
                  {t("readMore")}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
