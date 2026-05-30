"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { FileAudio, FileText, Mic, Upload } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import type { SourceType } from "@/lib/schemas";
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
import { RecordingPanel } from "@/components/meetings/recording-panel";
import { UploadProgress } from "@/components/meetings/upload-progress";
import { cn } from "@/lib/utils";

type FormType = "record" | "upload" | "notes";

const formTypes: {
  id: FormType;
  label: string;
  description: string;
  icon: typeof Mic;
  color: {
    active: string;
    icon: string;
    ring: string;
  };
}[] = [
  {
    id: "record",
    label: "Record meeting",
    description: "Capture audio in your browser",
    icon: Mic,
    color: {
      active: "border-primary bg-primary/20 shadow-md shadow-primary/15",
      icon: "bg-primary/30 text-primary",
      ring: "ring-primary/40",
    },
  },
  {
    id: "upload",
    label: "Upload meeting",
    description: "MP3 or MP4 file",
    icon: FileAudio,
    color: {
      active: "border-brand-peach bg-brand-peach/25 shadow-md shadow-brand-peach/20",
      icon: "bg-brand-peach/40 text-foreground",
      ring: "ring-brand-peach/50",
    },
  },
  {
    id: "notes",
    label: "Upload notes",
    description: "PDF document",
    icon: FileText,
    color: {
      active: "border-brand-lilac bg-brand-lilac/30 shadow-md shadow-brand-lilac/20",
      icon: "bg-brand-lilac/50 text-foreground",
      ring: "ring-brand-lilac/50",
    },
  },
];

const formCopy: Record<
  FormType,
  { title: string; description: string; submit: string; submitting: string }
> = {
  record: {
    title: "Record board meeting",
    description:
      "Use your microphone to record the meeting directly in the browser. We'll turn it into color-coded minutes.",
    submit: "Start recording",
    submitting: "Starting…",
  },
  upload: {
    title: "Upload board meeting recording",
    description:
      "Add an MP3 or MP4 of your HOA board meeting. We'll produce color-coded minutes with motions, votes, and action items.",
    submit: "Upload recording",
    submitting: "Uploading…",
  },
  notes: {
    title: "Upload meeting notes",
    description:
      "Add a PDF of existing board meeting notes. We'll extract and color-code motions, votes, and action items.",
    submit: "Upload notes",
    submitting: "Uploading…",
  },
};

const sourceTypeMap: Record<Exclude<FormType, "record">, SourceType> = {
  upload: "upload",
  notes: "notes",
};

export function UploadMeetingForm() {
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);
  const [formType, setFormType] = useState<FormType>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState({
    loaded: 0,
    total: null as number | null,
    percent: null as number | null,
  });
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);

  const copy = formCopy[formType];

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      sourceType,
    }: {
      file: File;
      sourceType: SourceType;
    }) => {
      setUploadingFileName(file.name);
      abortRef.current = new AbortController();
      return meetingsApi.create({
        file,
        sourceType,
        signal: abortRef.current.signal,
        onUploadProgress: setUploadProgress,
      });
    },
    onSuccess: (meeting) => {
      setUploadingFileName(null);
      router.push(`/meetings/${meeting.id}/edit`);
    },
    onError: (err: Error) => {
      setUploadingFileName(null);
      setMessage(err.message);
    },
  });

  function handleTypeChange(type: FormType) {
    if (uploadMutation.isPending) return;
    setFormType(type);
    setFileName(null);
    setMessage(null);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileName(file?.name ?? null);
    setMessage(null);
  }

  function handleCancelUpload() {
    abortRef.current?.abort();
    setUploadingFileName(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (formType === "record") return;

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      setMessage(
        formType === "notes"
          ? "Please choose a PDF file to upload."
          : "Please choose an MP3 or MP4 file to upload."
      );
      return;
    }

    const extension = file.name.toLowerCase().split(".").pop();

    if (formType === "upload") {
      if (!extension || !["mp3", "mp4"].includes(extension)) {
        setMessage("Only MP3 and MP4 files are supported.");
        return;
      }
    } else if (extension !== "pdf") {
      setMessage("Only PDF files are supported.");
      return;
    }

    uploadMutation.mutate({
      file,
      sourceType: sourceTypeMap[formType],
    });
  }

  return (
    <>
      {uploadingFileName && (
        <UploadProgress
          fileName={uploadingFileName}
          loaded={uploadProgress.loaded}
          total={uploadProgress.total}
          percent={uploadProgress.percent}
          onCancel={handleCancelUpload}
        />
      )}

      <div className="w-full max-w-2xl space-y-4">
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          role="tablist"
          aria-label="Meeting input type"
        >
          {formTypes.map(({ id, label, description, icon: Icon, color }) => {
            const isActive = formType === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={uploadMutation.isPending}
                onClick={() => handleTypeChange(id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition-all outline-none focus-visible:ring-3",
                  isActive
                    ? cn(color.active, color.ring)
                    : "border-border/60 bg-white hover:border-border hover:bg-muted/30"
                )}
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full transition-colors",
                    isActive ? color.icon : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </button>
            );
          })}
        </div>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{copy.title}</CardTitle>
            <CardDescription>{copy.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {formType === "record" ? (
              <RecordingPanel />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formType === "upload" && (
                  <div className="space-y-2">
                    <Label htmlFor="file">Audio or video file</Label>
                    <label
                      htmlFor="file"
                      className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-brand-peach/50 bg-brand-peach/15 px-6 py-10 transition-colors hover:border-brand-peach/70 hover:bg-brand-peach/25"
                    >
                      <span className="flex size-12 items-center justify-center rounded-full bg-brand-peach/35 text-foreground">
                        <Upload className="size-6" aria-hidden />
                      </span>
                      <span className="text-center text-sm text-muted-foreground">
                        {fileName ? (
                          <span className="font-medium text-foreground">{fileName}</span>
                        ) : (
                          <>
                            <span className="font-medium text-foreground">
                              Click to browse
                            </span>{" "}
                            or drag and drop MP3 or MP4
                          </>
                        )}
                      </span>
                      <Input
                        key="upload-file"
                        id="file"
                        name="file"
                        type="file"
                        accept="audio/mpeg,.mp3,audio/mp4,.mp4,video/mp4,.mp4"
                        className="sr-only"
                        onChange={handleFileChange}
                        required
                        disabled={uploadMutation.isPending}
                      />
                    </label>
                  </div>
                )}

                {formType === "notes" && (
                  <div className="space-y-2">
                    <Label htmlFor="file">PDF file</Label>
                    <label
                      htmlFor="file"
                      className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-brand-lilac/50 bg-brand-lilac/20 px-6 py-10 transition-colors hover:border-brand-lilac/70 hover:bg-brand-lilac/30"
                    >
                      <span className="flex size-12 items-center justify-center rounded-full bg-brand-lilac/45 text-foreground">
                        <FileText className="size-6" aria-hidden />
                      </span>
                      <span className="text-center text-sm text-muted-foreground">
                        {fileName ? (
                          <span className="font-medium text-foreground">{fileName}</span>
                        ) : (
                          <>
                            <span className="font-medium text-foreground">
                              Click to browse
                            </span>{" "}
                            or drag and drop your PDF
                          </>
                        )}
                      </span>
                      <Input
                        key="notes-file"
                        id="file"
                        name="file"
                        type="file"
                        accept="application/pdf,.pdf"
                        className="sr-only"
                        onChange={handleFileChange}
                        required
                        disabled={uploadMutation.isPending}
                      />
                    </label>
                  </div>
                )}

                {message && (
                  <p className="text-sm text-destructive" role="alert">
                    {message}
                  </p>
                )}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={uploadMutation.isPending}
                    onClick={() => router.push("/meetings")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    size="lg"
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? copy.submitting : copy.submit}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
