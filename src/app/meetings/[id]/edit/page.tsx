"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft, FileAudio, FileText, Loader2, Mic } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Meeting } from "@/lib/schemas";

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const sourceIcons = {
  record: Mic,
  upload: FileAudio,
  notes: FileText,
} as const;

export default function EditMeetingPage() {
  const t = useTranslations("meetings");
  const tc = useTranslations("common");
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const meetingId = params.id;

  const { data: meeting, isLoading, error } = useQuery({
    queryKey: ["meetings", meetingId],
    queryFn: () => meetingsApi.get(meetingId),
    refetchInterval: (query) =>
      query.state.data?.status === "processing" ? 3000 : false,
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (meeting?.title) {
      setTitle(meeting.title);
    }
  }, [meeting?.title]);

  useEffect(() => {
    if (meeting?.content !== undefined && meeting.content !== null) {
      setContent(meeting.content);
    }
  }, [meeting?.content]);

  const updateMutation = useMutation({
    mutationFn: (data: { title?: string; content?: string }) =>
      meetingsApi.updateMeeting(meetingId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["meetings", meetingId], updated);
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setSavedMessage(tc("saved"));
      setTimeout(() => setSavedMessage(null), 2000);
    },
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
          <Button render={<Link href="/meetings" />}>{t("backToMeetings")}</Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <EditMeetingContent
      meeting={meeting}
      title={title}
      content={content}
      savedMessage={savedMessage}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onBack={() => router.push("/meetings")}
      onSaveTitle={() => {
        if (title.trim()) {
          updateMutation.mutate({ title: title.trim() });
        }
      }}
      onSaveContent={() => updateMutation.mutate({ content })}
      isSaving={updateMutation.isPending}
    />
  );
}

function EditMeetingContent({
  meeting,
  title,
  content,
  savedMessage,
  onTitleChange,
  onContentChange,
  onBack,
  onSaveTitle,
  onSaveContent,
  isSaving,
}: {
  meeting: Meeting;
  title: string;
  content: string;
  savedMessage: string | null;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onBack: () => void;
  onSaveTitle: () => void;
  onSaveContent: () => void;
  isSaving: boolean;
}) {
  const t = useTranslations("meetings");
  const tc = useTranslations("common");

  const SourceIcon = sourceIcons[meeting.sourceType];
  const filename =
    meeting.file?.originalFilename ?? meeting.sourceFilename ?? null;

  const editDescription =
    meeting.status === "processing"
      ? t("editDescription.processing")
      : meeting.status === "ready"
        ? t("editDescription.ready")
        : meeting.status === "failed"
          ? t("editDescription.failed")
          : t("editDescription.default");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader showLogin={false} showLogout />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Button
          type="button"
          variant="ghost"
          className="mb-6 gap-2 px-0 hover:bg-transparent"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("backToMeetings")}
        </Button>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{t("editTitle")}</CardTitle>
            <CardDescription>{editDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSaveTitle();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">{t("meetingTitle")}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => onTitleChange(event.target.value)}
                  placeholder={t("titlePlaceholder")}
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? tc("saving") : t("saveTitle")}
                </Button>
                {savedMessage && (
                  <span className="text-sm text-muted-foreground" role="status">
                    {savedMessage}
                  </span>
                )}
              </div>
            </form>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <SourceIcon className="size-4 text-muted-foreground" aria-hidden />
                {t(`sourceLabels.${meeting.sourceType}`)}
              </div>
              <dl className="grid gap-2 text-sm">
                {filename && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{t("file")}</dt>
                    <dd className="truncate font-medium">{filename}</dd>
                  </div>
                )}
                {meeting.file && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{t("size")}</dt>
                    <dd>{formatBytes(meeting.file.sizeBytes)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t("uploaded")}</dt>
                  <dd>{formatDate(meeting.createdAt)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t("status")}</dt>
                  <dd>{t(`statusLabels.${meeting.status}`)}</dd>
                </div>
              </dl>
            </div>

            {meeting.status === "processing" && (
              <div
                className="flex items-center gap-3 rounded-lg bg-brand-lilac/20 px-4 py-3 text-sm text-muted-foreground"
                role="status"
              >
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {t("processingBanner")}
              </div>
            )}

            {meeting.status === "failed" && meeting.processingError && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {meeting.processingError}
              </p>
            )}

            {meeting.status === "ready" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  onSaveContent();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="content">{t("meetingContent")}</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(event) => onContentChange(event.target.value)}
                    placeholder={t("contentPlaceholder")}
                    rows={16}
                  />
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? tc("saving") : t("saveContent")}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
