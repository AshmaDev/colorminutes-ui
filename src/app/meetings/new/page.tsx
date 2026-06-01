import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UploadMeetingForm } from "@/components/meetings/upload-form";

export default async function NewMeetingPage() {
  const t = await getTranslations("meetings");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader showLogin={false} showLogout />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12">
        <div className="mb-8">
          <Link
            href="/meetings"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t("backToList")}
          </Link>
        </div>
        <div className="flex flex-1 items-start justify-center">
          <UploadMeetingForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
