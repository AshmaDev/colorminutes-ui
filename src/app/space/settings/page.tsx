"use client";

import { useTranslations } from "next-intl";
import { AppContainer } from "@/components/layout/app-container";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { SpaceSettingsForm } from "@/components/spaces/space-settings-form";
import { useAuth } from "@/providers/auth-provider";

export default function SpaceSettingsPage() {
  const t = useTranslations("spaces.settings");
  const tc = useTranslations("common");
  const { space, isLoading } = useAuth();

  return (
    <AppPageBackground variant="profile">
      <AppContainer className="flex flex-col">
        <AppPageHeader
          className="mb-10"
          title={t("title")}
          description={t("description")}
        />

        {isLoading ? (
          <p className="text-foreground/70">{tc("saving")}</p>
        ) : space ? (
          <SpaceSettingsForm
            key={`${space.id}:${space.name}:${space.visibility}`}
            space={space}
          />
        ) : null}
      </AppContainer>
    </AppPageBackground>
  );
}
