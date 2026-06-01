"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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
import { useAuth } from "@/providers/auth-provider";

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
    <Card className="w-full max-w-md border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{tc("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={tc("emailPlaceholder")}
              autoComplete="email"
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
            {mutation.isPending ? t("creating") : t("createAccount")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              {t("signIn")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
