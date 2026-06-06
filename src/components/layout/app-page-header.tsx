import { HomeSectionLabel } from "@/components/home/home-section-label";
import { appPageTitleClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

type AppPageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  label?: React.ReactNode;
  className?: string;
};

export function AppPageHeader({
  title,
  description,
  label,
  className,
}: AppPageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <HomeSectionLabel>{label}</HomeSectionLabel>}
      <h1 className={appPageTitleClassName}>{title}</h1>
      {description && (
        <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
