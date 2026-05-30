"use client";

import { Suspense } from "react";
import { MeetingsAuthGuard } from "@/components/auth/meetings-auth-guard";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-24 text-muted-foreground">
          Loading…
        </div>
      }
    >
      <MeetingsAuthGuard>{children}</MeetingsAuthGuard>
    </Suspense>
  );
}
