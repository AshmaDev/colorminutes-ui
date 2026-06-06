"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MeetingMinutesView } from "@/components/meetings/meeting-minutes-view";
import { Button } from "@/components/ui/button";

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
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader showLogin={false} showLogout />
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-6 py-12 text-muted-foreground">
          {t("loadingMeeting")}
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader showLogin={false} showLogout />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-12">
          <p className="text-muted-foreground">{t("notFound")}</p>
          <Button render={<Link href={`/meetings/${meetingId}`} />}>
            {t("backToEditor")}
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader showLogin={false} showLogout />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            className="gap-2 px-0 hover:bg-transparent"
            render={<Link href={`/meetings/${meetingId}`} />}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("backToEditor")}
          </Button>
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground">
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
      </main>
      <SiteFooter />
    </div>
  );
}
