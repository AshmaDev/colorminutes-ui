import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PublicMeetingPageClient } from "@/components/meetings/public-meeting-page-client";

type PageProps = {
  params: Promise<{ identifier: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { identifier } = await params;
  const t = await getTranslations("meetings");

  return {
    title: identifier,
    description: t("publicDescription", { title: identifier }),
    robots: { index: false, follow: false },
  };
}

export default async function PublicMeetingPage({ params }: PageProps) {
  const { identifier } = await params;
  return <PublicMeetingPageClient identifier={identifier} />;
}
