"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { getToken } from "@/lib/api/token";

export function MeetingsAuthGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth.guard");
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
        {t("checking")}
      </div>
    );
  }

  return <>{children}</>;
}
