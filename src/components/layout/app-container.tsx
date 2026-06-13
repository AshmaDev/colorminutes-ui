import { cn } from "@/lib/utils";

type AppContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppContainer({ children, className }: AppContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl flex-1 px-8 py-12 lg:px-10 lg:py-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
