"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import { AppContainer } from "@/components/layout/app-container";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { MeetingMinutesView } from "@/components/meetings/meeting-minutes-view";
import { Button } from "@/components/ui/button";
import {
  appBackLinkClassName,
} from "@/lib/landing-styles";
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
        <AppContainer className="flex items-center justify-center text-foreground/70">
          {t("loadingMeeting")}
        </AppContainer>
      </AppPageBackground>
    );
  }

  if (error || !meeting) {
    return (
      <AppPageBackground variant="preview">
        <AppContainer className="flex flex-col items-center justify-center gap-4">
          <p className="text-foreground/70">{t("notFound")}</p>
          <Button render={<Link href={`/meetings/${meetingId}`} />} variant="landing">
            {t("backToEditor")}
          </Button>
        </AppContainer>
      </AppPageBackground>
    );
  }

  return (
    <AppPageBackground variant="preview">
      <AppContainer>
        <div className="mb-8 flex items-center justify-between gap-4">
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
        <MeetingMinutesView
          title={meeting.title}
          sections={meeting.sections}
          untitledLabel={t("untitled")}
          createdAtLabel={t("createdOn", {
            date: new Date(meeting.createdAt).toLocaleDateString(undefined, {
              dateStyle: "long",
            }),
          })}
        />
      </AppContainer>
    </AppPageBackground>
  );
}
