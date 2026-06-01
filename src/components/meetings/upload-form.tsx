"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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

const formTypeIds: FormType[] = ["record", "upload", "notes"];

const formTypeIcons = {
  record: Mic,
  upload: FileAudio,
  notes: FileText,
} as const;

const formTypeColors = {
  record: {
    active: "border-primary bg-primary/20 shadow-md shadow-primary/15",
    icon: "bg-primary/30 text-primary",
    ring: "ring-primary/40",
  },
  upload: {
    active: "border-brand-peach bg-brand-peach/25 shadow-md shadow-brand-peach/20",
    icon: "bg-brand-peach/40 text-foreground",
    ring: "ring-brand-peach/50",
  },
  notes: {
    active: "border-brand-lilac bg-brand-lilac/30 shadow-md shadow-brand-lilac/20",
    icon: "bg-brand-lilac/50 text-foreground",
    ring: "ring-brand-lilac/50",
  },
} as const;

const sourceTypeMap: Record<Exclude<FormType, "record">, SourceType> = {
  upload: "upload",
  notes: "notes",
};

export function UploadMeetingForm() {
  const t = useTranslations("upload");
  const tc = useTranslations("common");
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
      setMessage(
        err.message === "Upload cancelled."
          ? tc("uploadCancelled")
          : err.message
      );
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
          ? t("errors.choosePdf")
          : t("errors.chooseAudio")
      );
      return;
    }

    const extension = file.name.toLowerCase().split(".").pop();

    if (formType === "upload") {
      if (!extension || !["mp3", "mp4"].includes(extension)) {
        setMessage(t("errors.audioOnly"));
        return;
      }
    } else if (extension !== "pdf") {
      setMessage(t("errors.pdfOnly"));
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
          aria-label={t("inputTypeAria")}
        >
          {formTypeIds.map((id) => {
            const Icon = formTypeIcons[id];
            const color = formTypeColors[id];
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
                <span className="text-sm font-semibold text-foreground">
                  {t(`formTypes.${id}.label`)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(`formTypes.${id}.description`)}
                </span>
              </button>
            );
          })}
        </div>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t(`copy.${formType}.title`)}</CardTitle>
            <CardDescription>{t(`copy.${formType}.description`)}</CardDescription>
          </CardHeader>
          <CardContent>
            {formType === "record" ? (
              <RecordingPanel />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formType === "upload" && (
                  <div className="space-y-2">
                    <Label htmlFor="file">{t("audioFile")}</Label>
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
                              {t("clickToBrowse")}
                            </span>{" "}
                            {t("dropAudio")}
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
                    <Label htmlFor="file">{t("pdfFile")}</Label>
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
                              {t("clickToBrowse")}
                            </span>{" "}
                            {t("dropPdf")}
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
                    {tc("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    size="lg"
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending
                      ? t(`copy.${formType}.submitting`)
                      : t(`copy.${formType}.submit`)}
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
