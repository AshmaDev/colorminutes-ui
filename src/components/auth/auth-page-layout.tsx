import { AuthPageAside } from "@/components/auth/auth-page-aside";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

type AuthPageLayoutProps = {
  variant: "login" | "register";
  children: React.ReactNode;
};

const backgroundByVariant = {
  login: "bg-brand-sky",
  register: "bg-brand-peach",
} as const;

export function AuthPageLayout({ variant, children }: AuthPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground">
      <SiteHeader variant="landing" showLogin={variant === "register"} />
      <main className="flex flex-1 flex-col">
        <section
          className={cn(
            "flex min-h-[calc(100vh-7.5rem)] flex-col justify-center border-b border-black",
            backgroundByVariant[variant],
          )}
        >
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
            <AuthPageAside variant={variant} />
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="border border-black bg-white p-6 sm:p-8">
                {children}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter variant="landing" />
    </div>
  );
}
