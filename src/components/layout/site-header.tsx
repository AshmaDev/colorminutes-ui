"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";
import { useAuth } from "@/providers/auth-provider";

type SiteHeaderProps = {
  showLogin?: boolean;
  showLogout?: boolean;
  variant?: "default" | "landing";
};

export function SiteHeader({
  showLogin = true,
  showLogout = false,
  variant = "default",
}: SiteHeaderProps) {
  const t = useTranslations("header");
  const { isAuthenticated, isLoading } = useAuth();
  const shouldShowLogin = showLogin && !isLoading && !isAuthenticated;
  const shouldShowMeetings = showLogin && !isLoading && isAuthenticated && !showLogout;
  const isLanding = variant === "landing";

  return (
    <header
      className={
        isLanding
          ? "border-b border-black bg-muted"
          : "border-b border-border/60 bg-muted"
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </Link>
        <nav className="flex items-center gap-3">
          {isLanding && !isAuthenticated && (
            <>
              <Link
                href="#pricing"
                className="hidden text-xs font-medium uppercase tracking-wider text-foreground hover:underline sm:inline"
              >
                {t("pricing")}
              </Link>
              <Link
                href="#faq"
                className="hidden text-xs font-medium uppercase tracking-wider text-foreground hover:underline sm:inline"
              >
                {t("faq")}
              </Link>
            </>
          )}
          {showLogout && <UserMenu />}
          {shouldShowMeetings && (
            <Button render={<Link href="/meetings" />} variant={isLanding ? "landing" : "default"}>
              {t("meetings")}
              {isLanding && <ArrowRight className="size-4" aria-hidden />}
            </Button>
          )}
          {shouldShowLogin && (
            <Button render={<Link href="/login" />} variant={isLanding ? "landing" : "default"}>
              {t("logIn")}
              {isLanding && <ArrowRight className="size-4" aria-hidden />}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
