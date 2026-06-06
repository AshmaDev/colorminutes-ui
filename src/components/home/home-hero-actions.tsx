"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { landingButtonSecondaryClassName } from "@/lib/landing-styles";
import { useAuth } from "@/providers/auth-provider";

export function HomeHeroActions() {
  const t = useTranslations("home");
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 pt-2">
        <Button variant="landing" size="xl" disabled>
          {t("getStarted")}
        </Button>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-wrap gap-4 pt-2">
        <Button render={<Link href="/meetings" />} variant="landing" size="xl">
          {t("goToMeetings")}
          <ArrowRight className="size-5" aria-hidden />
        </Button>
        <Button
          render={<Link href="/meetings/new" />}
          variant="landing"
          size="xl"
          className={landingButtonSecondaryClassName}
        >
          {t("addMeeting")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 pt-2">
      <Button render={<Link href="/register" />} variant="landing" size="xl">
        {t("getStarted")}
        <ArrowRight className="size-5" aria-hidden />
      </Button>
      <Button
        render={<Link href="/login" />}
        variant="landing"
        size="xl"
        className={landingButtonSecondaryClassName}
      >
        {t("logIn")}
      </Button>
    </div>
  );
}
