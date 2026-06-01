"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Mic, Pause, Play, Square } from "lucide-react";
import { meetingsApi } from "@/lib/api/meetings";
import { Button } from "@/components/ui/button";
import { UploadProgress } from "@/components/meetings/upload-progress";

const MAX_RECORDING_SECONDS = 3600;

type RecordingState = "idle" | "recording" | "paused" | "stopped" | "uploading";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function RecordingPanel() {
  const t = useTranslations("recording");
  const tc = useTranslations("common");
  const router = useRouter();
  const [state, setState] = useState<RecordingState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState({
    loaded: 0,
    total: null as number | null,
    percent: null as number | null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const blobRef = useRef<Blob | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
      cleanupStream();
      mediaRecorderRef.current?.stop();
    };
  }, [stopTimer, cleanupStream]);

  const uploadMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      const fileName = `recording-${Date.now()}.webm`;
      setUploadFileName(fileName);
      setState("uploading");
      abortRef.current = new AbortController();
      return meetingsApi.create({
        file: new File([blob], fileName, { type: blob.type || "audio/webm" }),
        sourceType: "record",
        signal: abortRef.current.signal,
        onUploadProgress: setUploadProgress,
      });
    },
    onSuccess: (meeting) => {
      router.push(`/meetings/${meeting.id}/edit`);
    },
    onError: (err: Error) => {
      setError(
        err.message === "Upload cancelled."
          ? tc("uploadCancelled")
          : err.message
      );
      setState("stopped");
      setUploadFileName(null);
    },
  });

  const stopRecording = useCallback(() => {
    stopTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    cleanupStream();
    setState("stopped");
  }, [stopTimer, cleanupStream]);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= MAX_RECORDING_SECONDS) {
          stopRecording();
        }
        return next;
      });
    }, 1000);
  }, [stopTimer, stopRecording]);

  async function handleStart() {
    setError(null);
    chunksRef.current = [];
    blobRef.current = null;
    setElapsed(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        blobRef.current = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
      };

      recorder.start(1000);
      setState("recording");
      startTimer();
    } catch {
      setError(t("micDenied"));
    }
  }

  function handlePauseResume() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (recorder.state === "recording") {
      recorder.pause();
      stopTimer();
      setState("paused");
    } else if (recorder.state === "paused") {
      recorder.resume();
      startTimer();
      setState("recording");
    }
  }

  function handleSave() {
    const blob = blobRef.current;
    if (!blob || blob.size === 0) {
      setError(t("noRecording"));
      return;
    }
    uploadMutation.mutate(blob);
  }

  function handleCancelUpload() {
    abortRef.current?.abort();
    setUploadFileName(null);
    setState("stopped");
  }

  const remaining = MAX_RECORDING_SECONDS - elapsed;

  return (
    <>
      {state === "uploading" && uploadFileName && (
        <UploadProgress
          fileName={uploadFileName}
          loaded={uploadProgress.loaded}
          total={uploadProgress.total}
          percent={uploadProgress.percent}
          onCancel={handleCancelUpload}
        />
      )}

      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-primary/40 bg-primary/10 px-6 py-10">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/25 text-primary">
            <Mic className="size-6" aria-hidden />
          </span>

          {state === "idle" && (
            <p className="max-w-xs text-center text-sm text-muted-foreground">
              {t("idleHint")}
            </p>
          )}

          {(state === "recording" || state === "paused") && (
            <div className="text-center">
              <p className="font-mono text-3xl font-semibold tabular-nums">
                {formatDuration(elapsed)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("remaining", { time: formatDuration(remaining) })}
              </p>
            </div>
          )}

          {state === "stopped" && (
            <p className="text-center text-sm text-muted-foreground">
              {t("complete", { time: formatDuration(elapsed) })}
            </p>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {state === "idle" && (
            <Button type="button" className="flex-1" size="lg" onClick={handleStart}>
              {t("start")}
            </Button>
          )}

          {(state === "recording" || state === "paused") && (
            <>
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                onClick={handlePauseResume}
              >
                {state === "recording" ? (
                  <>
                    <Pause className="size-4" aria-hidden />
                    {t("pause")}
                  </>
                ) : (
                  <>
                    <Play className="size-4" aria-hidden />
                    {t("resume")}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1 gap-2"
                onClick={stopRecording}
              >
                <Square className="size-4" aria-hidden />
                {t("stop")}
              </Button>
            </>
          )}

          {state === "stopped" && (
            <Button
              type="button"
              className="flex-1"
              size="lg"
              disabled={uploadMutation.isPending}
              onClick={handleSave}
            >
              {t("save")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
