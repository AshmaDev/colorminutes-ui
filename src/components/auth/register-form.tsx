"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";

const authFieldClassName =
  "rounded-none border-black focus-visible:border-black focus-visible:ring-black/20";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const tc = useTranslations("common");
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

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
            className={authFieldClassName}
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
            className={authFieldClassName}
            minLength={8}
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
