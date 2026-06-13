import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PublicSpacePageClient } from "@/components/spaces/public-space-page-client";

type PageProps = {
  params: Promise<{ identifier: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { identifier } = await params;
  const t = await getTranslations("spaces");

  return {
    title: t("pageTitle", { name: identifier }),
    description: t("pageDescription"),
    robots: { index: true, follow: true },
  };
}

export default async function PublicSpacePage({ params }: PageProps) {
  const { identifier } = await params;
  return <PublicSpacePageClient identifier={identifier} />;
}
