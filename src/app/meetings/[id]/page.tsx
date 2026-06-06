"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
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
import { sectionColorAtIndex } from "@/lib/section-colors";

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
    patch: Partial<Pick<EditableSection, "header" | "content">>
  ) => {
    setSections((current) => {
      const next = [...current];
      next[index] = { ...next[index]!, ...patch };
      return next;
    });
  };

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
        header: section.header.trim() || t("defaultSectionHeader"),
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
            <Card key={section.clientId} className="border-border/80 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">
                  {t("sectionLabel", { number: index + 1 })}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-destructive"
                  disabled={sections.length <= 1}
                  onClick={() => removeSection(index)}
                  aria-label={t("removeSection")}
                >
                  <Trash2 className="size-4" aria-hidden />
                  {t("removeSection")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={addSection}
          >
            <Plus className="size-4" aria-hidden />
            {t("addSection")}
          </Button>
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
