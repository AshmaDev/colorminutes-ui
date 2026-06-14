"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { spacesApi } from "@/lib/api/spaces";
import { landingFieldClassName } from "@/lib/landing-styles";
import type { SpaceVisibility } from "@/lib/schemas";

type CreateSpaceDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (space: Awaited<ReturnType<typeof spacesApi.create>>) => void;
};

export function CreateSpaceDialog({
  open,
  onClose,
  onCreated,
}: CreateSpaceDialogProps) {
  const t = useTranslations("spaces.createSpace");
  const ts = useTranslations("spaces");
  const tc = useTranslations("common");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [visibility, setVisibility] = useState<SpaceVisibility>("private");
  const [error, setError] = useState<string | null>(null);

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
    if (!open) {
      setVisibility("private");
      setError(null);
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: spacesApi.create,
    onSuccess: (space) => {
      onCreated(space);
      onClose();
    },
    onError: (err: Error) => setError(err.message),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const spacePassword = formData.get("spacePassword") as string;

    mutation.mutate({
      name: formData.get("spaceName") as string,
      visibility,
      password:
        visibility === "protected" && spacePassword ? spacePassword : undefined,
    });
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 z-[100] m-0 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border-0 bg-transparent p-0 shadow-none backdrop:bg-black/40"
      onClose={onClose}
    >
      <GlassCard
        as="form"
        method="dialog"
        padding="compact"
        className="space-y-6 overflow-hidden border border-border bg-popover text-popover-foreground shadow-xl shadow-black/10 backdrop-blur-none"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm text-foreground/70">{t("description")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-space-name">{ts("spaceName")}</Label>
          <Input
            id="create-space-name"
            name="spaceName"
            type="text"
            placeholder={ts("spaceNamePlaceholder")}
            className={landingFieldClassName}
            required
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">{ts("visibilityLabel")}</legend>
          {(["private", "public", "protected"] as const).map((option) => (
            <label
              key={option}
              className="flex cursor-pointer gap-3 rounded-2xl border border-foreground/10 p-4 has-checked:border-brand-lilac has-checked:bg-brand-lilac/15"
            >
              <input
                type="radio"
                name="spaceVisibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
                className="mt-1"
              />
              <span>
                <Label className="text-base">{ts(`visibility.${option}.title`)}</Label>
                <p className="text-sm text-foreground/70">
                  {ts(`visibility.${option}.description`)}
                </p>
              </span>
            </label>
          ))}
        </fieldset>

        {visibility === "protected" && (
          <div className="space-y-2">
            <Label htmlFor="create-space-password">{ts("spacePassword")}</Label>
            <Input
              id="create-space-password"
              name="spacePassword"
              type="password"
              placeholder={tc("passwordMinPlaceholder")}
              autoComplete="new-password"
              className={landingFieldClassName}
              minLength={8}
              required
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="landing" disabled={mutation.isPending}>
            {mutation.isPending ? t("creating") : t("submit")}
          </Button>
        </div>
      </GlassCard>
    </dialog>
  );
}
