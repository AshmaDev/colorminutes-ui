"use client";

import { Suspense } from "react";
import { MeetingsAuthGuard } from "@/components/auth/meetings-auth-guard";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col text-foreground">
          <SiteHeader variant="landing" showLogin={false} showLogout />
          <AppPageBackground variant="profile">
            <div className="flex flex-1 items-center justify-center py-24 text-foreground/70">
              Loading…
            </div>
          </AppPageBackground>
          <SiteFooter variant="landing" />
        </div>
      }
    >
      <MeetingsAuthGuard>
        <div className="flex min-h-screen flex-col text-foreground">
          <SiteHeader variant="landing" showLogin={false} showLogout />
          {children}
          <SiteFooter variant="landing" />
        </div>
      </MeetingsAuthGuard>
    </Suspense>
  );
}
