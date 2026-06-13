import type { ParagraphVariant } from "@/lib/schemas";

export const PARAGRAPH_VARIANTS: ParagraphVariant[] = [
  "normal",
  "important",
  "warning",
  "info",
  "success",
  "danger",
];

export const paragraphVariantBlockClass: Record<ParagraphVariant, string> = {
  normal: "",
  important:
    "rounded-2xl border border-foreground/10 bg-brand-yellow/40 px-5 py-4 border-l-4 border-l-brand-yellow",
  warning:
    "rounded-2xl border border-foreground/10 bg-brand-peach/50 px-5 py-4 border-l-4 border-l-brand-peach",
  info: "rounded-2xl border border-foreground/10 bg-brand-sky/50 px-5 py-4 border-l-4 border-l-brand-sky",
  success:
    "rounded-2xl border border-foreground/10 bg-brand-sage/50 px-5 py-4 border-l-4 border-l-brand-sage",
  danger:
    "rounded-2xl border border-destructive/20 bg-destructive/10 px-5 py-4 border-l-4 border-l-destructive",
};

export const paragraphVariantDotClass: Record<ParagraphVariant, string> = {
  normal: "bg-foreground/30",
  important: "bg-brand-yellow",
  warning: "bg-brand-peach",
  info: "bg-brand-sky",
  success: "bg-brand-sage",
  danger: "bg-destructive",
};

export function paragraphVariantLabelKey(
  variant: ParagraphVariant
): `paragraphVariants.${ParagraphVariant}` {
  return `paragraphVariants.${variant}`;
}
