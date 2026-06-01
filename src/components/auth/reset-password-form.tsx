"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { authApi } from "@/lib/api/auth";
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

function ResetPasswordFormInner() {
  const t = useTranslations("auth.resetPassword");
  const tc = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      router.push("/login");
    },
    onError: (err: Error) => setError(err.message),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!token) {
      setError(t("missingToken"));
      return;
    }
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      token,
      password: formData.get("password") as string,
    });
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">{t("invalidTitle")}</CardTitle>
          <CardDescription>{t("invalidDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/forgot-password" />} className="w-full">
            {t("requestNewLink")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{tc("newPassword")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={tc("passwordMinPlaceholder")}
              autoComplete="new-password"
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
            size="lg"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? t("updating") : t("updatePassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
