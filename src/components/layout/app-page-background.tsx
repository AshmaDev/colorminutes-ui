import { appPageBackgrounds, type AppPageBackground } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

type AppPageBackgroundProps = {
  variant: AppPageBackground;
  children: React.ReactNode;
  className?: string;
};

export function AppPageBackground({
  variant,
  children,
  className,
}: AppPageBackgroundProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        appPageBackgrounds[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
