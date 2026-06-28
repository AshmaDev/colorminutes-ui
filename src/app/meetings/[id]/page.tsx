"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { meetingsApi, type SectionInput } from "@/lib/api/meetings";
import { AppContainer } from "@/components/layout/app-container";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { UndoRemoveBanner } from "@/components/meetings/undo-remove-banner";
import { PublishDialog } from "@/components/meetings/publish-dialog";
import { PublishStatus } from "@/components/meetings/publish-status";
import {
  SectionParagraphEditor,
  type EditableParagraph,
} from "@/components/meetings/section-paragraph-editor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MeetingSection } from "@/lib/schemas";
import {
  appBackLinkClassName,
  landingButtonSecondaryClassName,
  landingFieldClassName,
  landingSurfaceClassName,
} from "@/lib/landing-styles";
import { paragraphColor, sectionColorAtIndex, sectionColorBarClass } from "@/lib/section-colors";
import { isMeetingPublished } from "@/lib/meeting-publish";
import { usePendingUndo } from "@/lib/use-pending-undo";
import { cn } from "@/lib/utils";

type PendingSectionUndo = {
  type: "section";
  section: EditableSection;
  index: number;
};

type PendingParagraphUndo = {
  type: "paragraph";
  sectionIndex: number;
  paragraph: EditableParagraph;
  index: number;
};

type PendingUndo = PendingSectionUndo | PendingParagraphUndo;

type EditableSection = {
  clientId: string;
  id?: string;
  header: string;
  navLabel: string | null;
  tag: MeetingSection["tag"];
  sortOrder: number;
  color: MeetingSection["color"];
  paragraphs: EditableParagraph[];
};

function createEmptyParagraph(
  sortOrder: number,
  sectionColor: MeetingSection["color"],
  sectionIndex: number,
): EditableParagraph {
  return {
    clientId: crypto.randomUUID(),
    content: "",
    sortOrder,
    variant: "normal",
    color: paragraphColor(sectionColor, sectionIndex, sortOrder),
  };
}

function toEditableSections(sections: MeetingSection[]): EditableSection[] {
  return sections
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section, sectionIndex) => ({
      clientId: section.id,
      id: section.id,
      header: section.header,
      navLabel: section.navLabel,
      tag: section.tag,
      sortOrder: section.sortOrder,
      color: section.color,
      paragraphs: [...section.paragraphs]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((paragraph) => ({
          clientId: paragraph.id,
          id: paragraph.id,
          content: paragraph.content,
          sortOrder: paragraph.sortOrder,
          variant: paragraph.variant,
          color: paragraph.color,
        })),
    }));
}

function buildEditorSnapshot(title: string, sections: EditableSection[]): string {
  return JSON.stringify({
    title: title.trim(),
    sections: sections.map((section, index) => ({
      id: section.id,
      header: section.header.trim(),
      navLabel: section.navLabel,
      tag: section.tag,
      sortOrder: index,
      color: section.color,
      paragraphs: section.paragraphs.map((paragraph, paragraphIndex) => ({
        id: paragraph.id,
        content: paragraph.content,
        sortOrder: paragraphIndex,
        variant: paragraph.variant,
        color: paragraph.color,
      })),
    })),
  });
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
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [syncedMeetingId, setSyncedMeetingId] = useState<string | null>(null);
  const { pending: pendingUndo, pushPending, revertPending } =
    usePendingUndo<PendingUndo>();

  if (meeting && meeting.id !== syncedMeetingId) {
    const meetingTitle = meeting.title ?? "";
    const editableSections = toEditableSections(meeting.sections);
    setSyncedMeetingId(meeting.id);
    setTitle(meetingTitle);
    setSections(editableSections);
    setLastSavedSnapshot(buildEditorSnapshot(meetingTitle, editableSections));
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
      const meetingTitle = updated.title ?? "";
      const editableSections = toEditableSections(updated.sections);
      setSyncedMeetingId(updated.id);
      setTitle(meetingTitle);
      setSections(editableSections);
      setLastSavedSnapshot(buildEditorSnapshot(meetingTitle, editableSections));
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => meetingsApi.publish(meetingId),
    onSuccess: (result) => {
      setPublishedUrl(result.url);
      queryClient.invalidateQueries({ queryKey: ["meetings", meetingId] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });

  const addSection = () => {
    setSections((current) => {
      const sectionColor = sectionColorAtIndex(current.length);
      return [
        ...current,
        {
          clientId: crypto.randomUUID(),
          header: "",
          navLabel: null,
          tag: null,
          sortOrder: current.length,
          color: sectionColor,
          paragraphs: [createEmptyParagraph(0, sectionColor, current.length)],
        },
      ];
    });
  };

  const removeSection = (index: number) => {
    if (sections.length <= 1) return;
    const removed = sections[index];
    if (!removed) return;
    pushPending({ type: "section", section: removed, index });
    setSections((current) => current.filter((_, i) => i !== index));
  };

  const updateSection = (
    index: number,
    patch: Partial<Pick<EditableSection, "header">>,
  ) => {
    setSections((current) => {
      const next = [...current];
      next[index] = { ...next[index]!, ...patch };
      return next;
    });
  };

  const updateParagraph = (
    sectionIndex: number,
    paragraphIndex: number,
    patch: Partial<Pick<EditableParagraph, "content" | "variant">>,
  ) => {
    setSections((current) => {
      const next = [...current];
      const section = next[sectionIndex];
      if (!section) return current;
      const paragraphs = [...section.paragraphs];
      paragraphs[paragraphIndex] = { ...paragraphs[paragraphIndex]!, ...patch };
      next[sectionIndex] = { ...section, paragraphs };
      return next;
    });
  };

  const addParagraph = (sectionIndex: number) => {
    setSections((current) => {
      const next = [...current];
      const section = next[sectionIndex];
      if (!section) return current;
      const paragraphIndex = section.paragraphs.length;
      next[sectionIndex] = {
        ...section,
        paragraphs: [
          ...section.paragraphs,
          createEmptyParagraph(paragraphIndex, section.color, sectionIndex),
        ],
      };
      return next;
    });
  };

  const removeParagraph = (sectionIndex: number, paragraphIndex: number) => {
    const section = sections[sectionIndex];
    if (!section || section.paragraphs.length <= 1) return;
    const removed = section.paragraphs[paragraphIndex];
    if (!removed) return;
    pushPending({
      type: "paragraph",
      sectionIndex,
      paragraph: removed,
      index: paragraphIndex,
    });
    setSections((current) => {
      const next = [...current];
      const target = next[sectionIndex];
      if (!target) return current;
      next[sectionIndex] = {
        ...target,
        paragraphs: target.paragraphs.filter((_, i) => i !== paragraphIndex),
      };
      return next;
    });
  };

  const handleUndoRemove = () => {
    revertPending((item) => {
      if (item.type === "section") {
        setSections((current) => {
          const next = [...current];
          next.splice(item.index, 0, item.section);
          return next;
        });
        return;
      }

      setSections((current) => {
        const next = [...current];
        const section = next[item.sectionIndex];
        if (!section) return current;
        const paragraphs = [...section.paragraphs];
        paragraphs.splice(item.index, 0, item.paragraph);
        next[item.sectionIndex] = { ...section, paragraphs };
        return next;
      });
    });
  };

  if (isLoading) {
    return (
      <AppPageBackground variant="editor">
        <AppContainer className="flex items-center justify-center text-foreground/70">
          {t("loadingMeeting")}
        </AppContainer>
      </AppPageBackground>
    );
  }

  if (error || !meeting || meeting.sections.length === 0) {
    return (
      <AppPageBackground variant="editor">
        <AppContainer className="flex flex-col items-center justify-center gap-4">
          <p className="text-foreground/70">{t("notFound")}</p>
          <Button render={<Link href="/meetings" />} variant="landing">
            {t("backToMeetings")}
          </Button>
        </AppContainer>
      </AppPageBackground>
    );
  }

  const handleSave = () => {
    saveMutation.mutate({
      title: title.trim() || t("untitled"),
      sections: sections.map((section, index) => ({
        id: section.id,
        header: section.header.trim() || t("defaultSectionHeader"),
        navLabel: section.navLabel,
        tag: section.tag,
        sortOrder: index,
        color: section.color,
        paragraphs: section.paragraphs.map((paragraph, paragraphIndex) => ({
          id: paragraph.id,
          content: paragraph.content,
          sortOrder: paragraphIndex,
          variant: paragraph.variant,
          color: paragraph.color,
        })),
      })),
    });
  };

  const isDirty =
    lastSavedSnapshot !== null &&
    buildEditorSnapshot(title, sections) !== lastSavedSnapshot;
  const showPublish = meeting ? !isMeetingPublished(meeting) : false;

  return (
    <>
      <AppPageBackground variant="editor">
        <AppContainer>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/meetings"
            className={cn(appBackLinkClassName, "inline-flex items-center gap-2 self-start")}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("backToMeetings")}
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {isDirty ? (
              <Button
                type="button"
                variant="landing"
                className={landingButtonSecondaryClassName}
                disabled={saveMutation.isPending}
                onClick={handleSave}
              >
                {saveMutation.isPending ? tc("saving") : tc("save")}
              </Button>
            ) : (
              <Button
                type="button"
                variant="landing"
                className={landingButtonSecondaryClassName}
                render={<Link href={`/meetings/${meetingId}/preview`} />}
              >
                {t("preview")}
              </Button>
            )}
            {showPublish && (
              <Button
                type="button"
                variant="landing"
                onClick={() => {
                  setPublishedUrl(null);
                  setPublishOpen(true);
                }}
              >
                {t("publish")}
              </Button>
            )}
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
                {sections.length > 1 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-foreground/60 hover:text-destructive"
                          aria-label={t("deleteSection")}
                        />
                      }
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-auto">
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer whitespace-nowrap"
                        onClick={() => removeSection(index)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                        {t("deleteSection")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
                  {(section.navLabel || section.tag) && (
                    <p className="text-xs text-foreground/60">
                      {section.navLabel && (
                        <span>
                          {t("navLabelDisplay", { label: section.navLabel })}
                        </span>
                      )}
                      {section.navLabel && section.tag && " · "}
                      {section.tag && (
                        <span>
                          {section.tag.emoji} {section.tag.label}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label>{t("sectionParagraphs")}</Label>
                  <div className="divide-y divide-foreground/10">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <SectionParagraphEditor
                        key={paragraph.clientId}
                        paragraph={paragraph}
                        index={paragraphIndex}
                        canRemove={section.paragraphs.length > 1}
                        onChange={(patch) =>
                          updateParagraph(index, paragraphIndex, patch)
                        }
                        onRemove={() => removeParagraph(index, paragraphIndex)}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-foreground/70"
                    onClick={() => addParagraph(index)}
                  >
                    <Plus className="size-4" aria-hidden />
                    {t("addParagraph")}
                  </Button>
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
        </AppContainer>
      </AppPageBackground>

      <PublishDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={() => publishMutation.mutate()}
        isPublishing={publishMutation.isPending}
        publishedUrl={publishedUrl}
      />

      {pendingUndo && (
        <UndoRemoveBanner
          message={
            pendingUndo.type === "section"
              ? t("sectionRemoved")
              : t("paragraphRemoved")
          }
          undoLabel={t("undoRemove")}
          onUndo={handleUndoRemove}
        />
      )}
    </>
  );
}
