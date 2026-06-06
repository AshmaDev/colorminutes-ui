import { GuestAuthGuard } from "@/components/auth/guest-auth-guard";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <GuestAuthGuard>
      <AuthPageLayout variant="register">
        <RegisterForm />
      </AuthPageLayout>
    </GuestAuthGuard>
  );
}
