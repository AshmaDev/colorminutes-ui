"use client";

import { Suspense } from "react";
import { MeetingsAuthGuard } from "@/components/auth/meetings-auth-guard";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { AppShell } from "@/components/layout/app-shell";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <AppShell>
          <AppPageBackground variant="profile">
            <div className="flex flex-1 items-center justify-center py-24 text-foreground/70">
              Loading…
            </div>
          </AppPageBackground>
        </AppShell>
      }
    >
      <MeetingsAuthGuard>
        <AppShell>{children}</AppShell>
      </MeetingsAuthGuard>
    </Suspense>
  );
}
