"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/auth-provider";

export function GuestAuthGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth.guard");
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/meetings");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        {t("checking")}
      </div>
    );
  }

  return <>{children}</>;
}
