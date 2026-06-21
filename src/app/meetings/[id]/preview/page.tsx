"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { MeetingMinutesView } from "@/components/meetings/meeting-minutes-view";
import { Button } from "@/components/ui/button";
import { appBackLinkClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

export default function MeetingPreviewPage() {
  const t = useTranslations("meetings");
  const params = useParams<{ id: string }>();
  const meetingId = params.id;

  const { data: meeting, isLoading, error } = useQuery({
    queryKey: ["meetings", meetingId, "preview"],
    queryFn: () => meetingsApi.getPreview(meetingId),
  });

  if (isLoading) {
    return (
      <AppPageBackground variant="preview">
        <div className="flex flex-1 items-center justify-center px-6 py-16 text-foreground/70">
          {t("loadingMeeting")}
        </div>
      </AppPageBackground>
    );
  }

  if (error || !meeting) {
    return (
      <AppPageBackground variant="preview">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16">
          <p className="text-foreground/70">{t("notFound")}</p>
          <Button render={<Link href={`/meetings/${meetingId}`} />} variant="landing">
            {t("backToEditor")}
          </Button>
        </div>
      </AppPageBackground>
    );
  }

  return (
    <AppPageBackground variant="preview" className="bg-[#f5f7fb]">
      <div className="border-b border-foreground/10 bg-white/60 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href={`/meetings/${meetingId}`}
            className={cn(appBackLinkClassName, "inline-flex items-center gap-2")}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("backToEditor")}
          </Link>
          <span className="rounded-full bg-brand-lilac/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground">
            {t("previewBadge")}
          </span>
        </div>
      </div>
      <MeetingMinutesView
        title={meeting.title}
        sections={meeting.sections}
        untitledLabel={t("untitled")}
        publishedAt={meeting.publishedAt}
        createdAtLabel={t("createdOn", {
          date: new Date(meeting.createdAt).toLocaleDateString(undefined, {
            dateStyle: "long",
          }),
        })}
        showPrint={false}
      />
    </AppPageBackground>
  );
}
