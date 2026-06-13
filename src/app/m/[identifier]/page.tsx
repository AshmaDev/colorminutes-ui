import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MeetingMinutesView } from "@/components/meetings/meeting-minutes-view";
import { publicMeetingSchema } from "@/lib/schemas";
import { appPageBackgroundClassName } from "@/lib/landing-styles";
import { getApiUrl } from "@/lib/api/token";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ identifier: string }>;
};

async function fetchPublicMeeting(identifier: string) {
  const response = await fetch(
    `${getApiUrl()}/public/meetings/${encodeURIComponent(identifier)}`,
    { next: { revalidate: 60 } }
  );
  if (!response.ok) {
    return null;
  }
  return publicMeetingSchema.parse(await response.json());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { identifier } = await params;
  const meeting = await fetchPublicMeeting(identifier);
  const t = await getTranslations("meetings");

  if (!meeting) {
    return { title: t("notFound") };
  }

  const title = meeting.title ?? t("untitled");
  const robots =
    meeting.visibility === "public"
      ? { index: true, follow: true }
      : { index: false, follow: false };

  return {
    title,
    description: t("publicDescription", { title }),
    robots,
  };
}

export default async function PublicMeetingPage({ params }: PageProps) {
  const { identifier } = await params;
  const meeting = await fetchPublicMeeting(identifier);
  const t = await getTranslations("meetings");

  if (!meeting) {
    notFound();
  }

  const createdAtLabel = t("createdOn", {
    date: new Date(meeting.createdAt).toLocaleDateString(undefined, {
      dateStyle: "long",
    }),
  });

  return (
    <div className={cn("flex min-h-screen flex-col", appPageBackgroundClassName)}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-20">
        <MeetingMinutesView
          title={meeting.title}
          sections={meeting.sections}
          untitledLabel={t("untitled")}
          createdAtLabel={createdAtLabel}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
