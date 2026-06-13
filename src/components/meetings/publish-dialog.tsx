"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

type PublishDialogProps = {
  open: boolean;
  onClose: () => void;
  onPublish: () => void;
  isPublishing: boolean;
  publishedUrl: string | null;
};

export function PublishDialog({
  open,
  onClose,
  onPublish,
  isPublishing,
  publishedUrl,
}: PublishDialogProps) {
  const t = useTranslations("meetings");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!publishedUrl) {
      setCopied(false);
    }
  }, [publishedUrl]);

  const copyLink = async () => {
    if (!publishedUrl) return;
    await navigator.clipboard.writeText(publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 z-50 m-0 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border-0 bg-transparent p-0 shadow-none backdrop:bg-black/40"
      onClose={onClose}
    >
      <GlassCard as="form" method="dialog" surface padding="compact" className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {publishedUrl ? t("publishDialog.publishedTitle") : t("publishDialog.title")}
          </h2>
          <p className="text-sm text-foreground/70">
            {publishedUrl
              ? t("publishDialog.publishedDescription")
              : t("publishDialog.description")}
          </p>
        </div>

        {publishedUrl ? (
          <div className="space-y-3">
            <div className="rounded-2xl bg-foreground/[0.04] px-3 py-2 text-sm break-all">
              {publishedUrl}
            </div>
            <Button type="button" variant="landing" className="w-full gap-2" onClick={copyLink}>
              {copied ? (
                <>
                  <Check className="size-4" />
                  {t("publishDialog.copied")}
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  {t("publishDialog.copyLink")}
                </>
              )}
            </Button>
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {publishedUrl ? t("publishDialog.close") : t("publishDialog.cancel")}
          </Button>
          {!publishedUrl && (
            <Button
              type="button"
              variant="landing"
              disabled={isPublishing}
              onClick={onPublish}
            >
              {isPublishing ? t("publishDialog.publishing") : t("publish")}
            </Button>
          )}
        </div>
      </GlassCard>
    </dialog>
  );
}
