"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { landingFieldClassName } from "@/lib/landing-styles";
import type { SpaceVisibility } from "@/lib/schemas";
import { useAuth } from "@/providers/auth-provider";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const ts = useTranslations("spaces");
  const tc = useTranslations("common");
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<SpaceVisibility>("private");

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      router.push("/meetings");
      router.refresh();
    },
    onError: (err: Error) => setError(err.message),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const spacePassword = formData.get("spacePassword") as string;

    mutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      space: {
        name: formData.get("spaceName") as string,
        visibility,
        password:
          visibility === "protected" && spacePassword ? spacePassword : undefined,
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("title")}
        </h2>
        <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
          {t("description")}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{tc("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={tc("emailPlaceholder")}
            autoComplete="email"
            className={landingFieldClassName}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{tc("password")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={tc("passwordMinPlaceholder")}
            autoComplete="new-password"
            className={landingFieldClassName}
            minLength={8}
            required
          />
        </div>

        <div className="space-y-2 border-t border-foreground/10 pt-4">
          <Label htmlFor="spaceName">{ts("spaceName")}</Label>
          <Input
            id="spaceName"
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
            <Label htmlFor="spacePassword">{ts("spacePassword")}</Label>
            <Input
              id="spacePassword"
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
        <Button
          type="submit"
          className="w-full"
          variant="landing"
          size="lg"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? t("creating") : t("createAccount")}
        </Button>
        <p className="text-center text-sm text-foreground/70">
          {t("hasAccount")}{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            {t("signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}
