"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export function HomeHeroActions() {
  const t = useTranslations("home");
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="landing" size="lg" disabled>
          {t("getStarted")}
        </Button>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-wrap gap-3 pt-2">
        <Button render={<Link href="/meetings" />} variant="landing" size="lg">
          {t("goToMeetings")}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
        <Button render={<Link href="/meetings/new" />} variant="landingOutline" size="lg">
          {t("addMeeting")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button render={<Link href="/register" />} variant="landing" size="lg">
        {t("getStarted")}
        <ArrowRight className="size-4" aria-hidden />
      </Button>
      <Button render={<Link href="/login" />} variant="landingOutline" size="lg">
        {t("logIn")}
      </Button>
    </div>
  );
}
