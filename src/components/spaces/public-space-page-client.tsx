"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SpaceAccessGate } from "@/components/spaces/space-access-gate";
import { SpaceMeetingList } from "@/components/spaces/space-meeting-list";
import { BackToTopButton } from "@/components/ui/back-to-top-button";
import {
  getStoredSpaceAccessToken,
  setStoredSpaceAccessToken,
  spacesApi,
} from "@/lib/api/spaces";
import type { PublicSpace } from "@/lib/schemas";

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

  const showBackToTop = (space?.meetings.length ?? 0) > 4;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader variant="landing" />
      <main className="flex-1">
        {isLoading && !space && !accessRequired && !membersOnly && (
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
            <p className="text-sm text-foreground/70">{t("loading")}</p>
          </div>
        )}

        {error && !accessRequired && !membersOnly && (
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          </div>
        )}

        {accessRequired && (
          <div className="mx-auto max-w-md px-6 py-16 sm:py-20">
            <SpaceAccessGate
              onSubmit={handlePasswordSubmit}
              error={error}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {membersOnly && (
          <div className="mx-auto max-w-md space-y-4 px-6 py-16 text-center sm:py-20">
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
          <>
            <header className="bg-brand-sky px-6 py-16 text-center sm:py-20">
              <div className="mx-auto max-w-3xl space-y-3">
                <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                  {space.name}
                </h1>
                <p className="text-sm font-medium uppercase tracking-wider text-foreground/70">
                  {t("publishedMeetings")}
                </p>
              </div>
            </header>

            <section className="px-6 py-12 sm:py-16">
              <div className="mx-auto max-w-3xl">
                <SpaceMeetingList meetings={space.meetings} />
              </div>
            </section>

            {showBackToTop && (
              <div className="no-print fixed bottom-6 right-4 z-40 sm:bottom-8 sm:right-6">
                <BackToTopButton inline />
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter variant="landing" />
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
