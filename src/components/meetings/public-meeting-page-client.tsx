"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MeetingMinutesView } from "@/components/meetings/meeting-minutes-view";
import { SpaceAccessGate } from "@/components/spaces/space-access-gate";
import { meetingsApi } from "@/lib/api/meetings";
import {
  getStoredSpaceAccessToken,
  setStoredSpaceAccessToken,
  spacesApi,
} from "@/lib/api/spaces";
import type { PublicMeeting } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type PublicMeetingPageClientProps = {
  identifier: string;
};

function PublicMeetingShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      <SiteHeader variant="landing" />
      <main className="flex-1">{children}</main>
      <SiteFooter variant="landing" />
    </div>
  );
}

export function PublicMeetingPageClient({ identifier }: PublicMeetingPageClientProps) {
  const t = useTranslations("meetings");
  const ts = useTranslations("spaces");
  const [meeting, setMeeting] = useState<PublicMeeting | null>(null);
  const [accessRequired, setAccessRequired] = useState(false);
  const [membersOnly, setMembersOnly] = useState(false);
  const [spaceSlug, setSpaceSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMeeting = useCallback(
    async (accessToken?: string | null, slugForToken?: string | null) => {
      setIsLoading(true);
      setError(null);
      const tokenKey = slugForToken ?? spaceSlug ?? identifier;
      try {
        const token =
          accessToken ?? getStoredSpaceAccessToken(tokenKey);
        const data = await meetingsApi.getPublic(identifier, token);
        setMeeting(data);
        setAccessRequired(false);
        setMembersOnly(false);
        setSpaceSlug(data.space.slug);
      } catch (err) {
        const apiError = err as Error & { code?: string; spaceSlug?: string };
        if (apiError.spaceSlug) {
          setSpaceSlug(apiError.spaceSlug);
        }
        if (apiError.code === "SPACE_PASSWORD_REQUIRED") {
          setAccessRequired(true);
          setMembersOnly(false);
          setMeeting(null);
        } else if (apiError.code === "SPACE_MEMBERS_ONLY") {
          setMembersOnly(true);
          setAccessRequired(false);
          setMeeting(null);
        } else {
          setError(apiError.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [identifier, spaceSlug]
  );

  useEffect(() => {
    void loadMeeting();
  }, [loadMeeting]);

  const handlePasswordSubmit = async (password: string) => {
    const slug = spaceSlug ?? identifier;
    setIsSubmitting(true);
    setError(null);
    try {
      const { accessToken } = await spacesApi.verifyAccess(slug, password);
      setStoredSpaceAccessToken(slug, accessToken);
      await loadMeeting(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : ts("accessGate.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !meeting && !accessRequired && !membersOnly) {
    return (
      <PublicMeetingShell>
        <div className="cm-public cm-page px-6 py-16">
          <p className="text-sm text-[#6b7280]">{t("loadingMeeting")}</p>
        </div>
      </PublicMeetingShell>
    );
  }

  if (error && !accessRequired && !membersOnly && !meeting) {
    return (
      <PublicMeetingShell>
        <div className="cm-public cm-page px-6 py-16">
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        </div>
      </PublicMeetingShell>
    );
  }

  return (
    <PublicMeetingShell>
      {accessRequired && (
        <div className="cm-public cm-page px-6 py-16">
          <div className="mx-auto max-w-md">
            <SpaceAccessGate
              onSubmit={handlePasswordSubmit}
              error={error}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {membersOnly && (
        <div className="cm-public cm-page px-6 py-16 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h1 className="text-2xl font-bold tracking-tight text-[#1f2937]">
              {ts("membersOnly.title")}
            </h1>
            <p className="text-sm text-[#6b7280]">{ts("membersOnly.description")}</p>
            <Link
              href={`/login?from=${encodeURIComponent(`/m/${identifier}`)}`}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[rgba(17,24,39,0.92)] px-6 text-sm font-bold text-white shadow-[0_12px_26px_rgba(17,24,39,0.16)] transition-opacity hover:opacity-90"
            >
              {ts("membersOnly.signIn")}
            </Link>
          </div>
        </div>
      )}

      {meeting && (
        <MeetingMinutesView
          title={meeting.title}
          sections={meeting.sections}
          untitledLabel={t("untitled")}
          publishedAt={meeting.publishedAt}
          createdAtLabel={t("createdOn", {
            date: new Date(meeting.createdAt).toLocaleDateString(undefined, {
              dateStyle: "long",
            }),
          })}
        />
      )}
    </PublicMeetingShell>
  );
}
