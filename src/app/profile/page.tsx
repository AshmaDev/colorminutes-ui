"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const { user, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader showLogin={false} showLogout />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("description")}</p>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">{tCommon("saving")}</p>
        ) : user ? (
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("email")}</p>
                <p className="mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("memberSince")}</p>
                <p className="mt-1">{formatDate(user.createdAt)}</p>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Link
                href="/forgot-password"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                {t("changePassword")}
              </Link>
            </CardFooter>
          </Card>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
