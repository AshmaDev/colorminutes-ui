"use client";

import { Suspense } from "react";
import { MeetingsAuthGuard } from "@/components/auth/meetings-auth-guard";
import { AppContainer } from "@/components/layout/app-container";
import { AppPageBackground } from "@/components/layout/app-page-background";
import { AppShell } from "@/components/layout/app-shell";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <AppShell>
          <AppPageBackground variant="list">
            <AppContainer className="flex items-center justify-center text-foreground/70">
              Loading…
            </AppContainer>
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
