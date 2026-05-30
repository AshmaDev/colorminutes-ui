import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <Image src="/icon.svg" alt="ColorMinutes" width={40} height={40} />

      <span className="font-semibold tracking-tight text-foreground">
        ColorMinutes
      </span>
    </div>
  );
}
