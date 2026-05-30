import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader showLogin={false} />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-6">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="font-medium text-foreground hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
