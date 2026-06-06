import { cn } from "@/lib/utils";

type HomeSectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function HomeSectionLabel({ children, className }: HomeSectionLabelProps) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-[0.2em] text-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
