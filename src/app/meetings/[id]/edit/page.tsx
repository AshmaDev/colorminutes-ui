"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileAudio, FileText, Mic } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const sourceLabels = {
  record: { label: "Browser recording", icon: Mic },
  upload: { label: "Uploaded recording", icon: FileAudio },
  notes: { label: "Uploaded notes", icon: FileText },
} as const;

export default function EditMeetingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const meetingId = params.id;

  const { data: meeting, isLoading, error } = useQuery({
    queryKey: ["meetings", meetingId],
    queryFn: () => meetingsApi.get(meetingId),
  });

  const [title, setTitle] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (meeting?.title) {
      setTitle(meeting.title);
    }
  }, [meeting?.title]);

  const updateMutation = useMutation({
    mutationFn: (newTitle: string) => meetingsApi.updateTitle(meetingId, newTitle),
    onSuccess: (updated) => {
      queryClient.setQueryData(["meetings", meetingId], updated);
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setSavedMessage("Saved");
      setTimeout(() => setSavedMessage(null), 2000);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader showLogin={false} showLogout />
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-6 py-12 text-muted-foreground">
          Loading meeting…
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
          <p className="text-muted-foreground">Meeting not found.</p>
          <Button render={<Link href="/meetings" />}>Back to meetings</Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const source = sourceLabels[meeting.sourceType];
  const SourceIcon = source.icon;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader showLogin={false} showLogout />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Button
          type="button"
          variant="ghost"
          className="mb-6 gap-2 px-0 hover:bg-transparent"
          onClick={() => router.push("/meetings")}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to meetings
        </Button>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Edit meeting</CardTitle>
            <CardDescription>
              Your file has been uploaded. Processing will be available soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (title.trim()) {
                  updateMutation.mutate(title.trim());
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Meeting title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Board meeting — March 2026"
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving…" : "Save title"}
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
                {source.label}
              </div>
              {meeting.file && (
                <dl className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">File</dt>
                    <dd className="truncate font-medium">{meeting.file.originalFilename}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Size</dt>
                    <dd>{formatBytes(meeting.file.sizeBytes)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Uploaded</dt>
                    <dd>{formatDate(meeting.file.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="capitalize">{meeting.status}</dd>
                  </div>
                </dl>
              )}
            </div>

            <p className="rounded-lg bg-brand-lilac/20 px-4 py-3 text-sm text-muted-foreground">
              Processing coming soon — color-coded minutes, motions, and action items
              will appear here.
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
