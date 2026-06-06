import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Image src="/icon.svg" alt="ColorMinutes" width={36} height={36} aria-hidden />

      <span className="font-sans text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        ColorMinutes
      </span>
    </div>
  );
}
