"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { landingFieldClassName } from "@/lib/landing-styles";

type SpaceAccessGateProps = {
  onSubmit: (password: string) => Promise<void>;
  error?: string | null;
  isSubmitting?: boolean;
};

export function SpaceAccessGate({
  onSubmit,
  error,
  isSubmitting = false,
}: SpaceAccessGateProps) {
  const t = useTranslations("spaces");
  const tc = useTranslations("common");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(password);
  }

  return (
    <GlassCard surface padding="compact" className="mx-auto w-full max-w-md space-y-4">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          {t("accessGate.title")}
        </h2>
        <p className="text-sm text-foreground/70">{t("accessGate.description")}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="space-access-password">{t("spacePassword")}</Label>
          <Input
            id="space-access-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={tc("passwordPlaceholder")}
            className={landingFieldClassName}
            required
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" variant="landing" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("accessGate.submitting") : t("accessGate.submit")}
        </Button>
      </form>
    </GlassCard>
  );
}
