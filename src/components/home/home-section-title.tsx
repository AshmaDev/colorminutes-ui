import { cn } from "@/lib/utils";

type HomeSectionTitleProps = {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function HomeSectionTitle({
  children,
  className,
  as: Tag = "h2",
}: HomeSectionTitleProps) {
  return (
    <Tag
      className={cn(
        "font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
