"use client";

import { useState, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { spacesApi } from "@/lib/api/spaces";
import { landingFieldClassName, landingSurfaceClassName } from "@/lib/landing-styles";
import type { Space, SpaceVisibility } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

type SpaceSettingsFormProps = {
  space: Space;
};

type SettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  as?: "section" | "form";
} & ComponentPropsWithoutRef<"section" | "form">;

function SettingsSection({
  title,
  description,
  children,
  as: Component = "section",
  className,
  ...props
}: SettingsSectionProps) {
  return (
    <Component
      className={cn(landingSurfaceClassName, "p-6 sm:p-8", className)}
      {...props}
    >
      <div className="mb-6 space-y-1">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-foreground/70">{description}</p>
        ) : null}
      </div>
      {children}
    </Component>
  );
}

function SettingsFeedback({
  error,
  saved,
  savedLabel,
}: {
  error: string | null;
  saved: boolean;
  savedLabel: string;
}) {
  if (!error && !saved) {
    return null;
  }

  return (
    <div className="space-y-2">
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {saved && !error ? (
        <p className="text-sm text-emerald-700" role="status">
          {savedLabel}
        </p>
      ) : null}
    </div>
  );
}

export function SpaceSettingsForm({ space }: SpaceSettingsFormProps) {
  const t = useTranslations("spaces.settings");
  const ts = useTranslations("spaces");
  const tc = useTranslations("common");
  const { setSpace } = useAuth();
  const [name, setName] = useState(space.name);
  const [visibility, setVisibility] = useState<SpaceVisibility>(space.visibility);
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaved, setNameSaved] = useState(false);
  const [visibilityError, setVisibilityError] = useState<string | null>(null);
  const [visibilitySaved, setVisibilitySaved] = useState(false);

  const nameMutation = useMutation({
    mutationFn: () => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error(t("name.required"));
      }
      if (trimmedName === space.name) {
        throw new Error(t("noChanges"));
      }
      return spacesApi.update(space.id, { name: trimmedName });
    },
    onSuccess: (updated) => {
      setSpace(updated);
      setNameError(null);
      setNameSaved(true);
    },
    onError: (err: Error) => {
      setNameSaved(false);
      setNameError(err.message);
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: () => {
      const payload: {
        visibility?: SpaceVisibility;
        password?: string;
      } = {};

      if (visibility !== space.visibility) {
        payload.visibility = visibility;
      }
      if (visibility === "protected" && password) {
        payload.password = password;
      }

      if (payload.visibility === undefined && payload.password === undefined) {
        throw new Error(t("noChanges"));
      }

      if (
        visibility === "protected" &&
        space.visibility !== "protected" &&
        !password
      ) {
        throw new Error(t("passwordRequired"));
      }

      return spacesApi.update(space.id, payload);
    },
    onSuccess: (updated) => {
      setSpace(updated);
      setPassword("");
      setVisibilityError(null);
      setVisibilitySaved(true);
    },
    onError: (err: Error) => {
      setVisibilitySaved(false);
      setVisibilityError(err.message);
    },
  });

  const passwordRequired =
    visibility === "protected" && space.visibility !== "protected";
  const nameChanged = name.trim() !== space.name;
  const visibilityChanged =
    visibility !== space.visibility ||
    (visibility === "protected" && password.length > 0);

  return (
    <div className="space-y-6">
      <SettingsSection title={t("spaceLink.title")} description={t("spaceLink.description")}>
        <Link
          href={`/s/${space.slug}`}
          target="_blank"
          className="inline-block break-all text-sm text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
        >
          /s/{space.slug}
        </Link>
      </SettingsSection>

      <SettingsSection
        as="form"
        title={t("name.title")}
        description={t("name.description")}
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          setNameError(null);
          setNameSaved(false);
          nameMutation.mutate();
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="space-name">{ts("spaceName")}</Label>
            <Input
              id="space-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={ts("spaceNamePlaceholder")}
              className={landingFieldClassName}
              required
            />
          </div>

          <SettingsFeedback
            error={nameError}
            saved={nameSaved}
            savedLabel={tc("saved")}
          />

          <Button
            type="submit"
            variant="landing"
            disabled={nameMutation.isPending || !nameChanged}
          >
            {nameMutation.isPending ? tc("saving") : tc("save")}
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        as="form"
        title={t("visibility.title")}
        description={t("visibility.description")}
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          setVisibilityError(null);
          setVisibilitySaved(false);
          visibilityMutation.mutate();
        }}
      >
        <div className="space-y-4">
          <fieldset className="space-y-3">
            <legend className="sr-only">{ts("visibilityLabel")}</legend>
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
              <Label htmlFor="space-password">
                {passwordRequired ? ts("spacePassword") : t("newPasswordOptional")}
              </Label>
              <Input
                id="space-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={tc("passwordMinPlaceholder")}
                autoComplete="new-password"
                className={landingFieldClassName}
                minLength={passwordRequired ? 8 : undefined}
                required={passwordRequired}
              />
              {!passwordRequired && (
                <p className="text-xs text-foreground/60">{t("passwordHint")}</p>
              )}
            </div>
          )}

          <SettingsFeedback
            error={visibilityError}
            saved={visibilitySaved}
            savedLabel={tc("saved")}
          />

          <Button
            type="submit"
            variant="landing"
            disabled={visibilityMutation.isPending || !visibilityChanged}
          >
            {visibilityMutation.isPending ? tc("saving") : tc("save")}
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}
