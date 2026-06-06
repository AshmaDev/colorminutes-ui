"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { meetingsApi, type SectionInput } from "@/lib/api/meetings";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { PublishDialog } from "@/components/meetings/publish-dialog";
import { PublishStatus } from "@/components/meetings/publish-status";
import { RichTextEditor } from "@/components/meetings/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MeetingSection } from "@/lib/schemas";
import {
  appBackLinkClassName,
  appPageMainNarrowClassName,
  landingButtonSecondaryClassName,
  landingFieldClassName,
  landingSurfaceClassName,
} from "@/lib/landing-styles";
import { sectionColorAtIndex, sectionColorBarClass } from "@/lib/section-colors";
import { cn } from "@/lib/utils";

type EditableSection = {
  clientId: string;
  id?: string;
  header: string;
  content: string;
  sortOrder: number;
  color: MeetingSection["color"];
};

function toEditableSections(sections: MeetingSection[]): EditableSection[] {
  return sections
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => ({
      clientId: section.id,
      id: section.id,
      header: section.header,
      content: section.content,
      sortOrder: section.sortOrder,
      color: section.color,
    }));
}

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
  const [syncedMeetingId, setSyncedMeetingId] = useState<string | null>(null);

  if (meeting && meeting.id !== syncedMeetingId) {
    setSyncedMeetingId(meeting.id);
    setTitle(meeting.title ?? "");
    setSections(toEditableSections(meeting.sections));
  }

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
      setSyncedMeetingId(updated.id);
      setSections(toEditableSections(updated.sections));
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

  const addSection = () => {
    setSections((current) => [
      ...current,
      {
        clientId: crypto.randomUUID(),
        header: "",
        content: "",
        sortOrder: current.length,
        color: sectionColorAtIndex(current.length),
      },
    ]);
  };

  const removeSection = (index: number) => {
    setSections((current) => {
      if (current.length <= 1) return current;
      return current.filter((_, i) => i !== index);
    });
  };

  const updateSection = (
    index: number,
    patch: Partial<Pick<EditableSection, "header" | "content">>,
  ) => {
    setSections((current) => {
      const next = [...current];
      next[index] = { ...next[index]!, ...patch };
      return next;
    });
  };

  if (isLoading) {
    return (
      <AppPageBackground variant="editor">
        <main
          className={cn(
            appPageMainNarrowClassName,
            "flex items-center justify-center text-foreground/70",
          )}
        >
          {t("loadingMeeting")}
        </main>
      </AppPageBackground>
    );
  }

  if (error || !meeting || meeting.sections.length === 0) {
    return (
      <AppPageBackground variant="editor">
        <main
          className={cn(
            appPageMainNarrowClassName,
            "flex flex-col items-center justify-center gap-4",
          )}
        >
          <p className="text-foreground/70">{t("notFound")}</p>
          <Button render={<Link href="/meetings" />} variant="landing">
            {t("backToMeetings")}
          </Button>
        </main>
      </AppPageBackground>
    );
  }

  const handleSave = () => {
    if (!title.trim()) return;
    saveMutation.mutate({
      title: title.trim(),
      sections: sections.map((section, index) => ({
        id: section.id,
        header: section.header.trim() || t("defaultSectionHeader"),
        content: section.content,
        sortOrder: index,
        color: section.color,
      })),
    });
  };

  return (
    <>
      <AppPageBackground variant="editor">
        <main className={appPageMainNarrowClassName}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/meetings"
            className={cn(appBackLinkClassName, "inline-flex items-center gap-2 self-start")}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("backToMeetings")}
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {savedMessage && (
              <span className="text-sm text-foreground/70" role="status">
                {savedMessage}
              </span>
            )}
            <Button
              type="button"
              variant="landing"
              disabled={saveMutation.isPending}
              onClick={handleSave}
            >
              {saveMutation.isPending ? tc("saving") : t("saveAll")}
            </Button>
            <Button
              type="button"
              variant="landing"
              className={landingButtonSecondaryClassName}
              render={<Link href={`/meetings/${meetingId}/preview`} />}
            >
              {t("preview")}
            </Button>
            <Button
              type="button"
              variant="landing"
              className={landingButtonSecondaryClassName}
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
              className={landingFieldClassName}
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground/70">{t("publishStatus")}:</span>
            <PublishStatus
              visibility={meeting.visibility}
              publishedAt={meeting.publishedAt}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.clientId}
              className={cn(landingSurfaceClassName, "p-6 sm:p-8")}
            >
              <div className="mb-4 flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-8 w-1 shrink-0 rounded-full",
                      sectionColorBarClass[section.color],
                    )}
                    aria-hidden
                  />
                  <p className="text-base font-medium text-foreground/70">
                    {t("sectionLabel", { number: index + 1 })}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-foreground/60 hover:text-destructive"
                  disabled={sections.length <= 1}
                  onClick={() => removeSection(index)}
                  aria-label={t("removeSection")}
                >
                  <Trash2 className="size-4" aria-hidden />
                  {t("removeSection")}
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`section-header-${section.clientId}`}>
                    {t("sectionHeader")}
                  </Label>
                  <Input
                    id={`section-header-${section.clientId}`}
                    value={section.header}
                    onChange={(event) =>
                      updateSection(index, { header: event.target.value })
                    }
                    placeholder={t("defaultSectionHeader")}
                    className={landingFieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("sectionContent")}</Label>
                  <RichTextEditor
                    value={section.content}
                    onChange={(html) => updateSection(index, { content: html })}
                    placeholder={t("sectionContentPlaceholder")}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="landing"
            className={cn("gap-2", landingButtonSecondaryClassName)}
            onClick={addSection}
          >
            <Plus className="size-4" aria-hidden />
            {t("addSection")}
          </Button>
        </div>
        </main>
      </AppPageBackground>

      <PublishDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={(visibility) => publishMutation.mutate(visibility)}
        isPublishing={publishMutation.isPending}
        publishedUrl={publishedUrl}
      />
    </>
  );
}
