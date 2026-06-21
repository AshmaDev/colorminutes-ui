"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PublicSpaceMeeting } from "@/lib/schemas";
import {
  cmContentSectionsClassName,
  cmGradientClass,
  cmSectionBodyClassName,
  cmSectionClassName,
  cmSectionHeadClassName,
} from "@/lib/colorminutes-public-styles";
import { sectionColorAtIndex } from "@/lib/section-colors";
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
      <p className={cn("text-sm text-[#6b7280]", className)}>
        {t("noMeetings")}
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
            <Link href={href} className={cn(cmSectionClassName, "block no-underline")}>
              <div className={cn(cmSectionHeadClassName, cmGradientClass(color))}>
                <h2 className="m-0 text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold text-[#1f2937]">
                  {title}
                </h2>
              </div>
              <div className={cn(cmSectionBodyClassName, "text-[0.97rem] text-[#6b7280]")}>
                {date}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
