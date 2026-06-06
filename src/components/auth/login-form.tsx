"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { landingFieldClassName } from "@/lib/landing-styles";
import { useAuth } from "@/providers/auth-provider";

function LoginFormInner() {
  const t = useTranslations("auth.login");
  const tc = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      const from = searchParams.get("from") ?? "/meetings";
      router.push(from);
      router.refresh();
    },
    onError: (err: Error) => setError(err.message),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{tc("password")}</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={tc("passwordPlaceholder")}
            autoComplete="current-password"
            className={landingFieldClassName}
            required
          />
        </div>
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
          {mutation.isPending ? t("signingIn") : t("signIn")}
        </Button>
        <p className="text-center text-sm text-foreground/70">
          {t("noAccount")}{" "}
          <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            {t("createOne")}
          </Link>
        </p>
      </form>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense>
      <LoginFormInner />
    </Suspense>
  );
}
