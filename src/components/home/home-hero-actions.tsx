"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export function HomeHeroActions() {
  const t = useTranslations("home");
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3 pt-2">
        <Button size="lg" disabled>
          {t("getStarted")}
        </Button>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-wrap gap-3 pt-2">
        <Button render={<Link href="/meetings" />} size="lg">
          {t("goToMeetings")}
        </Button>
        <Button render={<Link href="/meetings/new" />} variant="outline" size="lg">
          {t("addMeeting")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button render={<Link href="/register" />} size="lg">
        {t("getStarted")}
      </Button>
      <Button render={<Link href="/login" />} variant="outline" size="lg">
        {t("logIn")}
      </Button>
    </div>
  );
}
