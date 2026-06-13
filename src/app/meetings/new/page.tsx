import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppContainer } from "@/components/layout/app-container";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { UploadMeetingForm } from "@/components/meetings/upload-form";
import { appBackLinkClassName } from "@/lib/landing-styles";

export default async function NewMeetingPage() {
  const t = await getTranslations("meetings");

  return (
    <AppPageBackground variant="new">
      <AppContainer className="flex flex-col">
        <div className="mb-8">
          <Link href="/meetings" className={appBackLinkClassName}>
            {t("backToList")}
          </Link>
        </div>
        <UploadMeetingForm />
      </AppContainer>
    </AppPageBackground>
  );
}
