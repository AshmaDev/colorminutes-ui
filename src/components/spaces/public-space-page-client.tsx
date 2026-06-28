"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MinutesSearchBar } from "@/components/meetings/public/minutes-search-bar";
import { TagFilterChips } from "@/components/meetings/public/tag-filter-chips";
import { SpaceAccessGate } from "@/components/spaces/space-access-gate";
import { SpaceMeetingList } from "@/components/spaces/space-meeting-list";
import { BackToTopButton } from "@/components/ui/back-to-top-button";
import {
  getStoredSpaceAccessToken,
  setStoredSpaceAccessToken,
  spacesApi,
} from "@/lib/api/spaces";
import type { PublicSpace } from "@/lib/schemas";
import {
  cmHeroClassName,
  cmMiniCardClassName,
  cmPageClassName,
  cmWrapClassName,
} from "@/lib/colorminutes-public-styles";
import {
  collectTagsFromMeetings,
  meetingMatchesSearch,
  meetingMatchesTag,
} from "@/lib/minutes-filter";
import { cn } from "@/lib/utils";

type PublicSpacePageClientProps = {
  identifier: string;
};

export function PublicSpacePageClient({ identifier }: PublicSpacePageClientProps) {
  const t = useTranslations("spaces");
  const tm = useTranslations("meetings");
  const [space, setSpace] = useState<PublicSpace | null>(null);
  const [accessRequired, setAccessRequired] = useState(false);
  const [membersOnly, setMembersOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const loadSpace = useCallback(
    async (accessToken?: string | null) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await spacesApi.getPublic(
          identifier,
          accessToken ?? getStoredSpaceAccessToken(identifier),
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
    [identifier],
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

  const allTags = useMemo(
    () => collectTagsFromMeetings(space?.meetings ?? []),
    [space?.meetings],
  );

  const filteredMeetings = useMemo(() => {
    if (!space) {
      return [];
    }

    return space.meetings.filter(
      (meeting) =>
        meetingMatchesSearch(meeting, searchQuery) &&
        meetingMatchesTag(meeting, activeTag),
    );
  }, [space, searchQuery, activeTag]);

  const showBackToTop = filteredMeetings.length > 4;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader variant="landing" />
      <main className="flex-1">
        {isLoading && !space && !accessRequired && !membersOnly && (
          <div className={cn(cmPageClassName, "cm-page px-6 py-16")}>
            <p className="text-sm text-[#6b7280]">{t("loading")}</p>
          </div>
        )}

        {error && !accessRequired && !membersOnly && (
          <div className={cn(cmPageClassName, "cm-page px-6 py-16")}>
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          </div>
        )}

        {accessRequired && (
          <div className={cn(cmPageClassName, "cm-page px-6 py-16")}>
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
          <div className={cn(cmPageClassName, "cm-page px-6 py-16 text-center")}>
            <div className="mx-auto max-w-md space-y-4">
              <h1 className="text-2xl font-bold tracking-tight text-[#1f2937]">
                {t("membersOnly.title")}
              </h1>
              <p className="text-sm text-[#6b7280]">{t("membersOnly.description")}</p>
              <ButtonLink href={`/login?from=${encodeURIComponent(`/s/${identifier}`)}`}>
                {t("membersOnly.signIn")}
              </ButtonLink>
            </div>
          </div>
        )}

        {space && (
          <div className={cn(cmPageClassName, "cm-page")} id="top">
            <div className={cmWrapClassName}>
              <section className={cmHeroClassName}>
                <h1 className="relative z-[1] m-0 text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#1f2937]">
                  {space.name}
                </h1>
                <p className="relative z-[1] mt-2.5 max-w-[760px] text-base text-[#6b7280]">
                  {t("hubSubtitle")}
                </p>

                <div className="relative z-[1] mt-[18px] grid grid-cols-1 gap-3.5 md:grid-cols-3">
                  <div className={cmMiniCardClassName}>
                    <strong className="mb-1.5 block text-[0.96rem]">
                      {tm("readingTipLabel")}
                    </strong>
                    <span className="text-[0.92rem] text-[#6b7280]">
                      {t("hubReadingTip")}
                    </span>
                  </div>
                  <div className={cmMiniCardClassName}>
                    <strong className="mb-1.5 block text-[0.96rem]">
                      {tm("goodFollowUpLabel")}
                    </strong>
                    <span className="text-[0.92rem] text-[#6b7280]">
                      {tm("goodFollowUp")}
                    </span>
                  </div>
                  <div className={cmMiniCardClassName}>
                    <strong className="mb-1.5 block text-[0.96rem]">
                      {t("meetingsLabel")}
                    </strong>
                    <span className="text-[0.92rem] text-[#6b7280]">
                      {t("publishedMeetingsCount", { count: space.meetings.length })}
                    </span>
                  </div>
                </div>

                <MinutesSearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  matchCount={filteredMeetings.length}
                />

                <TagFilterChips
                  tags={allTags}
                  activeTag={activeTag}
                  onChange={setActiveTag}
                />
              </section>

              <SpaceMeetingList
                meetings={filteredMeetings}
                emptyMessage={
                  space.meetings.length === 0
                    ? t("noMeetings")
                    : t("noMeetingsMatch")
                }
              />
            </div>

            {showBackToTop && <BackToTopButton />}
          </div>
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
      className="inline-flex h-10 items-center justify-center rounded-full bg-[rgba(17,24,39,0.92)] px-6 text-sm font-bold text-white shadow-[0_12px_26px_rgba(17,24,39,0.16)] transition-opacity hover:opacity-90"
    >
      {children}
    </Link>
  );
}
