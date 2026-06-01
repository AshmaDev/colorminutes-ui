import { GuestAuthGuard } from "@/components/auth/guest-auth-guard";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <GuestAuthGuard>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-12">
          <ResetPasswordForm />
        </main>
        <SiteFooter />
      </div>
    </GuestAuthGuard>
  );
}
