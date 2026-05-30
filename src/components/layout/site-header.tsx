"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

type SiteHeaderProps = {
  showLogin?: boolean;
  showLogout?: boolean;
};

export function SiteHeader({
  showLogin = true,
  showLogout = false,
}: SiteHeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="border-b border-border/60 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </Link>
        <nav className="flex items-center gap-3">
          {showLogout && (
            <Button type="button" variant="ghost" onClick={logout}>
              Log out
            </Button>
          )}
          {showLogin && (
            <Button render={<Link href="/login" />}>
              Log in
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
