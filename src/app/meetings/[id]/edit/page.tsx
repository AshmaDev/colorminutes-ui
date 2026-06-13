"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft, FileAudio, FileText, Loader2, Mic } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import { AppContainer } from "@/components/layout/app-container";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PublishStatus } from "@/components/meetings/publish-status";
import type { Meeting } from "@/lib/schemas";
import {
  appBackLinkClassName,
  landingButtonSecondaryClassName,
  landingFieldClassName,
  landingSurfaceClassName,
} from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

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
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "processing" || status === "generating" ? 3000 : false;
    },
  });

  const [content, setContent] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [syncedContent, setSyncedContent] = useState<string | undefined>(
    undefined,
  );

  if (meeting) {
    const meetingContent = meeting.file?.content;
    if (meetingContent != null && syncedContent !== meetingContent) {
      setSyncedContent(meetingContent);
      setContent(meetingContent);
    }
  }

  useEffect(() => {
    if (meeting?.status === "generated" || meeting?.sections.length) {
      router.replace(`/meetings/${meetingId}`);
    }
  }, [meeting?.status, meeting?.sections.length, meetingId, router]);

  const updateMutation = useMutation({
    mutationFn: (data: { content: string }) =>
      meetingsApi.updateMeeting(meetingId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["meetings", meetingId], updated);
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setSavedMessage(tc("saved"));
      setTimeout(() => setSavedMessage(null), 2000);
    },
  });

  const generateMutation = useMutation({
    mutationFn: () => meetingsApi.generate(meetingId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["meetings", meetingId], updated);
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });

  if (isLoading) {
    return (
      <AppPageBackground variant="edit">
        <AppContainer className="flex items-center justify-center text-foreground/70">
          {t("loadingMeeting")}
        </AppContainer>
      </AppPageBackground>
    );
  }

  if (error || !meeting) {
    return (
      <AppPageBackground variant="edit">
        <AppContainer className="flex flex-col items-center justify-center gap-4">
          <p className="text-foreground/70">{t("notFound")}</p>
          <Button render={<Link href="/meetings" />} variant="landing">
            {t("backToMeetings")}
          </Button>
        </AppContainer>
      </AppPageBackground>
    );
  }

  return (
    <EditMeetingContent
      meeting={meeting}
      content={content}
      savedMessage={savedMessage}
      onContentChange={setContent}
      onBack={() => router.push("/meetings")}
      onSaveDraft={() => updateMutation.mutate({ content })}
      onGenerate={() => generateMutation.mutate()}
      isSaving={updateMutation.isPending}
      isGenerating={generateMutation.isPending || meeting.status === "generating"}
    />
  );
}

function EditMeetingContent({
  meeting,
  content,
  savedMessage,
  onContentChange,
  onBack,
  onSaveDraft,
  onGenerate,
  isSaving,
  isGenerating,
}: {
  meeting: Meeting;
  content: string;
  savedMessage: string | null;
  onContentChange: (value: string) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onGenerate: () => void;
  isSaving: boolean;
  isGenerating: boolean;
}) {
  const t = useTranslations("meetings");
  const tc = useTranslations("common");

  const SourceIcon = sourceIcons[meeting.sourceType];
  const filename = meeting.file?.originalFilename ?? null;

  const editDescription =
    meeting.status === "processing"
      ? t("editDescription.processing")
      : meeting.status === "generating"
        ? t("editDescription.generating")
        : meeting.status === "ready"
          ? t("editDescription.ready")
          : meeting.status === "failed"
            ? t("editDescription.failed")
            : t("editDescription.default");

  const canGenerate =
    (meeting.status === "ready" || meeting.status === "failed") &&
    content.trim().length > 0 &&
    meeting.sections.length === 0;

  const showContentEditor =
    meeting.status === "ready" || meeting.status === "failed";

  return (
    <AppPageBackground variant="edit">
      <AppContainer>
      <button
        type="button"
        onClick={onBack}
        className={cn(
          appBackLinkClassName,
          "mb-6 inline-flex items-center gap-2 bg-transparent p-0",
        )}
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("backToMeetings")}
      </button>

      <div className={cn(landingSurfaceClassName, "p-6 sm:p-8")}>
        <div className="mb-6 space-y-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("editTitle")}
          </h1>
          <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
            {editDescription}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3 rounded-2xl bg-foreground/[0.04] p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <SourceIcon className="size-4 text-foreground/60" aria-hidden />
              {t(`sourceLabels.${meeting.sourceType}`)}
            </div>
            <dl className="grid gap-2 text-sm">
              {filename && (
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground/60">{t("file")}</dt>
                  <dd className="truncate font-medium">{filename}</dd>
                </div>
              )}
              {meeting.file && (
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground/60">{t("size")}</dt>
                  <dd>{formatBytes(meeting.file.sizeBytes)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-foreground/60">{t("uploaded")}</dt>
                <dd>{formatDate(meeting.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-foreground/60">{t("status")}</dt>
                <dd>{t(`statusLabels.${meeting.status}`)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-foreground/60">{t("publishStatus")}</dt>
                <dd>
                  <PublishStatus
                    publishedAt={meeting.publishedAt}
                    className="text-sm"
                  />
                </dd>
              </div>
            </dl>
          </div>

          {meeting.status === "processing" && (
            <div
              className={cn(
                landingSurfaceClassName,
                "flex items-center gap-3 border-l-4 border-foreground/15 px-4 py-3 text-sm text-foreground/70",
              )}
              role="status"
            >
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t("processingBanner")}
            </div>
          )}

          {meeting.status === "generating" && (
            <div
              className={cn(
                landingSurfaceClassName,
                "flex items-center gap-3 border-l-4 border-foreground/15 px-4 py-3 text-sm text-foreground/70",
              )}
              role="status"
            >
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t("generatingBanner")}
            </div>
          )}

          {meeting.status === "failed" && meeting.processingError && (
            <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {meeting.processingError}
            </p>
          )}

          {showContentEditor && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">{t("meetingContent")}</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(event) => onContentChange(event.target.value)}
                  placeholder={t("contentPlaceholder")}
                  rows={16}
                  className={landingFieldClassName}
                />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                {savedMessage && (
                  <span className="text-sm text-foreground/70" role="status">
                    {savedMessage}
                  </span>
                )}
                <Button
                  type="button"
                  variant="landing"
                  className={landingButtonSecondaryClassName}
                  disabled={isSaving}
                  onClick={onSaveDraft}
                >
                  {isSaving ? tc("saving") : t("saveDraftMeeting")}
                </Button>
                {canGenerate && (
                  <Button
                    type="button"
                    variant="landing"
                    className="gap-2"
                    disabled={isGenerating}
                    onClick={onGenerate}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        {t("generatingColorMinutes")}
                      </>
                    ) : (
                      t("generateColorMinutes")
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </AppContainer>
    </AppPageBackground>
  );
}
