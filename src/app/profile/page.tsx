"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { useAuth } from "@/providers/auth-provider";
import { appPageMainClassName, landingSurfaceClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const { user, isLoading } = useAuth();

  return (
    <AppPageBackground variant="profile">
      <main className={cn(appPageMainClassName, "flex flex-col")}>
        <AppPageHeader
          className="mb-10"
          title={t("title")}
          description={t("description")}
        />

        {isLoading ? (
          <p className="text-foreground/70">{tCommon("saving")}</p>
        ) : user ? (
          <div className={cn(landingSurfaceClassName, "max-w-lg p-6 sm:p-8")}>
            <div className="space-y-1 border-b border-foreground/10 pb-6">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                {t("title")}
              </h2>
              <p className="text-sm text-foreground/70">{user.email}</p>
            </div>
            <div className="space-y-4 pt-6">
              <div>
                <p className="text-sm font-medium text-foreground/70">{t("email")}</p>
                <p className="mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/70">
                  {t("memberSince")}
                </p>
                <p className="mt-1">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div className="mt-6 border-t border-foreground/10 pt-6">
              <Link
                href="/forgot-password"
                className="text-sm text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
              >
                {t("changePassword")}
              </Link>
            </div>
          </div>
        ) : null}
      </main>
    </AppPageBackground>
  );
}
