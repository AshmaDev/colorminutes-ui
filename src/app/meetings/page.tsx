"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Plus, FileAudio, FileText, Mic } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import type { Meeting } from "@/lib/schemas";

type MeetingsTranslator = (key: string) => string;

const sourceIcons = {
  record: Mic,
  upload: FileAudio,
  notes: FileText,
} as const;

const statusStyles = {
  draft: "text-muted-foreground",
  uploaded: "text-muted-foreground",
  processing: "text-amber-700",
  ready: "text-emerald-700",
  failed: "text-destructive",
} as const;

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
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader showLogin={false} showLogout />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
            <p className="mt-2 text-muted-foreground">{t("description")}</p>
          </div>
          <Button
            render={<Link href="/meetings/new" />}
            size="lg"
            className="gap-2 px-8 shadow-md shadow-primary/15"
          >
            <Plus className="size-5" aria-hidden />
            {t("uploadMeeting")}
          </Button>
        </div>

        {isLoading && (
          <p className="text-center text-muted-foreground py-20">{t("loading")}</p>
        )}

        {error && (
          <p className="text-center text-destructive py-20">{t("loadError")}</p>
        )}

        {!isLoading && !error && meetings?.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-white py-20">
            <p className="mb-8 text-center text-muted-foreground">{t("empty")}</p>
            <Button
              render={<Link href="/meetings/new" />}
              size="lg"
              className="gap-2 px-8 shadow-md shadow-primary/15"
            >
              <Plus className="size-5" aria-hidden />
              {t("uploadMeeting")}
            </Button>
          </div>
        )}

        {meetings && meetings.length > 0 && (
          <ul className="divide-y divide-border/60 rounded-2xl border border-border/80 bg-white">
            {meetings.map((meeting) => (
              <MeetingRow key={meeting.id} meeting={meeting} t={t} />
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
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
        href={`/meetings/${meeting.id}/edit`}
        className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="size-4 text-muted-foreground" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {meeting.title ?? t("untitled")}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDate(meeting.createdAt)}
            {meeting.file
              ? ` · ${meeting.file.originalFilename}`
              : meeting.sourceFilename
                ? ` · ${meeting.sourceFilename}`
                : ""}
          </p>
        </div>
        <span
          className={`shrink-0 text-xs font-medium ${statusStyles[meeting.status]}`}
        >
          {t(`statusLabels.${meeting.status}`)}
        </span>
      </Link>
    </li>
  );
}
