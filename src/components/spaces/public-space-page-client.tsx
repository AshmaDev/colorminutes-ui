"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SpaceAccessGate } from "@/components/spaces/space-access-gate";
import { SpaceMeetingList } from "@/components/spaces/space-meeting-list";
import {
  getStoredSpaceAccessToken,
  setStoredSpaceAccessToken,
  spacesApi,
} from "@/lib/api/spaces";
import type { PublicSpace } from "@/lib/schemas";
import { appPageBackgroundClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

type PublicSpacePageClientProps = {
  identifier: string;
};

export function PublicSpacePageClient({ identifier }: PublicSpacePageClientProps) {
  const t = useTranslations("spaces");
  const [space, setSpace] = useState<PublicSpace | null>(null);
  const [accessRequired, setAccessRequired] = useState(false);
  const [membersOnly, setMembersOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadSpace = useCallback(
    async (accessToken?: string | null) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await spacesApi.getPublic(
          identifier,
          accessToken ?? getStoredSpaceAccessToken(identifier)
        );
        setSpace(data);
        setAccessRequired(false);
        setMembersOnly(false);
      } catch (err) {
        const apiError = err as Error & { code?: string; status?: number };
        if (apiError.code === "SPACE_PASSWORD_REQUIRED") {
          setAccessRequired(true);
          setMembersOnly(false);
          setSpace(null);
        } else if (apiError.code === "SPACE_MEMBERS_ONLY") {
          setMembersOnly(true);
          setAccessRequired(false);
          setSpace(null);
        } else {
          setError(apiError.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [identifier]
  );

  useEffect(() => {
    void loadSpace();
  }, [loadSpace]);

  const handlePasswordSubmit = async (password: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { accessToken } = await spacesApi.verifyAccess(identifier, password);
      setStoredSpaceAccessToken(identifier, accessToken);
      await loadSpace(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("accessGate.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex min-h-screen flex-col", appPageBackgroundClassName)}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:py-20">
        {isLoading && !space && !accessRequired && !membersOnly && (
          <p className="text-sm text-foreground/70">{t("loading")}</p>
        )}

        {error && !accessRequired && !membersOnly && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {accessRequired && (
          <SpaceAccessGate
            onSubmit={handlePasswordSubmit}
            error={error}
            isSubmitting={isSubmitting}
          />
        )}

        {membersOnly && (
          <div className="mx-auto max-w-md space-y-4 text-center">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {t("membersOnly.title")}
            </h1>
            <p className="text-sm text-foreground/70">{t("membersOnly.description")}</p>
            <ButtonLink href={`/login?from=${encodeURIComponent(`/s/${identifier}`)}`}>
              {t("membersOnly.signIn")}
            </ButtonLink>
          </div>
        )}

        {space && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {space.name}
              </h1>
              <p className="text-sm text-foreground/70">{t("publishedMeetings")}</p>
            </div>
            <SpaceMeetingList meetings={space.meetings} />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
    >
      {children}
    </Link>
  );
}
