import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { glassEffectClassName } from "@/lib/landing-styles";
import { cn } from "@/lib/utils";

const glassCardVariants = cva(glassEffectClassName, {
  variants: {
    surface: {
      true: "overflow-hidden",
      false: "",
    },
    padding: {
      default: "p-8 sm:p-10",
      lg: "p-8 sm:p-12",
      compact: "p-6",
    },
    highlighted: {
      true: "bg-white/90 shadow-xl shadow-black/[0.08]",
      false: "",
    },
  },
  defaultVariants: {
    surface: false,
    padding: "default",
    highlighted: false,
  },
});

type GlassCardProps<T extends React.ElementType = "article"> = {
  as?: T;
} & VariantProps<typeof glassCardVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof VariantProps<typeof glassCardVariants> | "as">;

function GlassCard<T extends React.ElementType = "article">({
  as,
  className,
  surface,
  padding,
  highlighted,
  ...props
}: GlassCardProps<T>) {
  const Component = as ?? "article";

  return (
    <Component
      data-slot="glass-card"
      className={cn(glassCardVariants({ surface, padding, highlighted, className }))}
      {...props}
    />
  );
}

export { GlassCard, glassCardVariants };
