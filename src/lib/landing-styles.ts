export const landingSectionClassName = "flex min-h-screen flex-col justify-center";

export const glassEffectClassName =
  "rounded-3xl bg-white/75 shadow-lg shadow-black/[0.06] backdrop-blur-sm";

export const landingSurfaceClassName = `${glassEffectClassName} overflow-hidden`;

export const landingCardClassName = `${glassEffectClassName} p-8 sm:p-10`;

export const landingFieldClassName =
  "rounded-2xl border-0 bg-foreground/[0.04] shadow-inner shadow-black/[0.03] focus-visible:border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand-sky/40";

export const landingButtonSecondaryClassName =
  "border border-foreground/15 bg-white/70 text-foreground shadow-none hover:border-foreground/25 hover:bg-white focus-visible:ring-foreground/20 active:translate-y-0";

export const appPageBackgroundClassName = "bg-muted";

export const appPageBackgrounds = {
  list: appPageBackgroundClassName,
  new: appPageBackgroundClassName,
  editor: appPageBackgroundClassName,
  edit: appPageBackgroundClassName,
  preview: appPageBackgroundClassName,
  profile: appPageBackgroundClassName,
} as const;

export type AppPageBackground = keyof typeof appPageBackgrounds;

export const appPageTitleClassName =
  "font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl";

export const appBackLinkClassName =
  "text-sm text-foreground/70 transition-colors hover:text-foreground hover:underline";
