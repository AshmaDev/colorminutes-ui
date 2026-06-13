"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Plus, FileAudio, FileText, Mic } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { Button } from "@/components/ui/button";
import { PublishStatus } from "@/components/meetings/publish-status";
import { appPageMainClassName, landingSurfaceClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";
import type { Meeting } from "@/lib/schemas";

type MeetingsTranslator = (key: string) => string;

const sourceIcons = {
  record: Mic,
  upload: FileAudio,
  notes: FileText,
} as const;

const sourceIconClassName =
  "bg-foreground/[0.06] text-foreground/70";

const statusStyles = {
  draft: "text-foreground/60",
  uploaded: "text-foreground/60",
  processing: "text-amber-700",
  ready: "text-emerald-700",
  generating: "text-amber-700",
  generated: "text-emerald-700",
  failed: "text-destructive",
} as const;

function meetingHref(meeting: Meeting): string {
  if (meeting.status === "generated" || meeting.sections.length > 0) {
    return `/meetings/${meeting.id}`;
  }
  return `/meetings/${meeting.id}/edit`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export default function MeetingsPage() {
  const t = useTranslations("meetings");
  const { data: meetings, isLoading, error } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingsApi.list,
  });

  return (
    <AppPageBackground variant="list">
      <main className={cn(appPageMainClassName, "flex flex-col")}>
      <div className="mb-10">
        <AppPageHeader title={t("title")} description={t("description")} />
      </div>

      {isLoading && (
        <p className="py-20 text-center text-foreground/70">{t("loading")}</p>
      )}

      {error && (
        <p className="py-20 text-center text-destructive">{t("loadError")}</p>
      )}

      {!isLoading && !error && meetings?.length === 0 && (
        <div
          className={cn(
            landingSurfaceClassName,
            "flex flex-1 flex-col items-center justify-center py-20",
          )}
        >
          <p className="mb-8 text-center text-foreground/70">{t("empty")}</p>
          <Button
            render={<Link href="/meetings/new" />}
            variant="landing"
            size="lg"
            className="gap-2"
          >
            <Plus className="size-5" aria-hidden />
            {t("uploadMeeting")}
          </Button>
        </div>
      )}

      {meetings && meetings.length > 0 && (
        <ul className={cn(landingSurfaceClassName, "divide-y divide-foreground/10")}>
          {meetings.map((meeting) => (
            <MeetingRow key={meeting.id} meeting={meeting} t={t} />
          ))}
        </ul>
      )}
      </main>
    </AppPageBackground>
  );
}

function MeetingRow({
  meeting,
  t,
}: {
  meeting: Meeting;
  t: MeetingsTranslator;
}) {
  const Icon = sourceIcons[meeting.sourceType];

  return (
    <li>
      <Link
        href={meetingHref(meeting)}
        className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-foreground/[0.03]"
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            sourceIconClassName,
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {meeting.title ?? t("untitled")}
          </p>
          <p className="text-sm text-foreground/60">
            {formatDate(meeting.createdAt)}
            {meeting.file
              ? ` · ${meeting.file.originalFilename}`
              : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={`text-xs font-medium ${statusStyles[meeting.status]}`}
          >
            {t(`statusLabels.${meeting.status}`)}
          </span>
          <PublishStatus
            visibility={meeting.visibility}
            publishedAt={meeting.publishedAt}
          />
        </div>
      </Link>
    </li>
  );
}
