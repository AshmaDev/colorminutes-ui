"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { meetingsApi, type SectionInput } from "@/lib/api/meetings";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublishDialog } from "@/components/meetings/publish-dialog";
import { PublishStatus } from "@/components/meetings/publish-status";
import { RichTextEditor } from "@/components/meetings/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MeetingSection } from "@/lib/schemas";
import { sectionColorTextClass } from "@/lib/section-colors";

type EditableSection = {
  id?: string;
  header: string;
  content: string;
  sortOrder: number;
  color: MeetingSection["color"];
};

export default function MeetingMinutesPage() {
  const t = useTranslations("meetings");
  const tc = useTranslations("common");
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const meetingId = params.id;

  const { data: meeting, isLoading, error } = useQuery({
    queryKey: ["meetings", meetingId],
    queryFn: () => meetingsApi.get(meetingId),
  });

  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<EditableSection[]>([]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!meeting) return;
    setTitle(meeting.title ?? "");
    setSections(
      meeting.sections
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((section) => ({
          id: section.id,
          header: section.header,
          content: section.content,
          sortOrder: section.sortOrder,
          color: section.color,
        }))
    );
  }, [meeting]);

  useEffect(() => {
    if (meeting?.status === "ready") {
      router.replace(`/meetings/${meetingId}/edit`);
    }
  }, [meeting?.status, meetingId, router]);

  const saveMutation = useMutation({
    mutationFn: (data: { title?: string; sections: SectionInput[] }) =>
      meetingsApi.saveSections(meetingId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["meetings", meetingId], updated);
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setSavedMessage(tc("saved"));
      setTimeout(() => setSavedMessage(null), 2000);
    },
  });

  const publishMutation = useMutation({
    mutationFn: (visibility: "public" | "link") =>
      meetingsApi.publish(meetingId, visibility),
    onSuccess: (result) => {
      setPublishedUrl(result.url);
      queryClient.invalidateQueries({ queryKey: ["meetings", meetingId] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader showLogin={false} showLogout />
        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-6 py-12 text-muted-foreground">
          {t("loadingMeeting")}
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !meeting || meeting.sections.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader showLogin={false} showLogout />
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-4 px-6 py-12">
          <p className="text-muted-foreground">{t("notFound")}</p>
          <Button render={<Link href="/meetings" />}>{t("backToMeetings")}</Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const handleSave = () => {
    if (!title.trim()) return;
    saveMutation.mutate({
      title: title.trim(),
      sections: sections.map((section, index) => ({
        id: section.id,
        header: section.header.trim(),
        content: section.content,
        sortOrder: index,
        color: section.color,
      })),
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader showLogin={false} showLogout />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            className="gap-2 px-0 hover:bg-transparent self-start"
            render={<Link href="/meetings" />}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("backToMeetings")}
          </Button>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {savedMessage && (
              <span className="text-sm text-muted-foreground" role="status">
                {savedMessage}
              </span>
            )}
            <Button
              type="button"
              variant="outline"
              disabled={saveMutation.isPending}
              onClick={handleSave}
            >
              {saveMutation.isPending ? tc("saving") : t("saveAll")}
            </Button>
            <Button
              type="button"
              variant="outline"
              render={<Link href={`/meetings/${meetingId}/preview`} />}
            >
              {t("preview")}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setPublishedUrl(null);
                setPublishOpen(true);
              }}
            >
              {t("publish")}
            </Button>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">{t("meetingTitle")}</Label>
            <Input
              id="meeting-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("titlePlaceholder")}
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("publishStatus")}:</span>
            <PublishStatus
              visibility={meeting.visibility}
              publishedAt={meeting.publishedAt}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={section.id ?? `new-${index}`} className="border-border/80 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">
                  {t("sectionLabel", { number: index + 1 })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`section-header-${index}`}>{t("sectionHeader")}</Label>
                  <Input
                    id={`section-header-${index}`}
                    value={section.header}
                    onChange={(event) => {
                      const next = [...sections];
                      next[index] = { ...section, header: event.target.value };
                      setSections(next);
                    }}
                    className={sectionColorTextClass[section.color]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("sectionContent")}</Label>
                  <RichTextEditor
                    value={section.content}
                    onChange={(html) => {
                      const next = [...sections];
                      next[index] = { ...section, content: html };
                      setSections(next);
                    }}
                    placeholder={t("sectionContentPlaceholder")}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />

      <PublishDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={(visibility) => publishMutation.mutate(visibility)}
        isPublishing={publishMutation.isPending}
        publishedUrl={publishedUrl}
      />
    </div>
  );
}
