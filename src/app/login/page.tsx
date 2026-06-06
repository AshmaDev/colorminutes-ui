import { GuestAuthGuard } from "@/components/auth/guest-auth-guard";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <GuestAuthGuard>
      <AuthPageLayout variant="login">
        <LoginForm />
      </AuthPageLayout>
    </GuestAuthGuard>
  );
}
