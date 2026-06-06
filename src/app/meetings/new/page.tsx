import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { UploadMeetingForm } from "@/components/meetings/upload-form";
import { appBackLinkClassName, appPageMainClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

export default async function NewMeetingPage() {
  const t = await getTranslations("meetings");

  return (
    <AppPageBackground variant="new">
      <main className={cn(appPageMainClassName, "flex flex-col")}>
        <div className="mb-8">
          <Link href="/meetings" className={appBackLinkClassName}>
            {t("backToList")}
          </Link>
        </div>
        <div className="flex flex-1 items-start justify-center">
          <UploadMeetingForm />
        </div>
      </main>
    </AppPageBackground>
  );
}
