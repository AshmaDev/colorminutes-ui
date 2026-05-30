"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api/token";

export function MeetingsAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      const from = window.location.pathname;
      router.replace(`/login?from=${encodeURIComponent(from)}`);
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-muted-foreground">
        Checking authentication…
      </div>
    );
  }

  return <>{children}</>;
}
