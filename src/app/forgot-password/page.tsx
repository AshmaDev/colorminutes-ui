import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-12">
        <ForgotPasswordForm />
      </main>
      <SiteFooter />
    </div>
  );
}
