export const landingSectionClassName = "flex min-h-screen flex-col justify-center";

export const landingSurfaceClassName =
  "overflow-hidden rounded-3xl bg-white/75 shadow-lg shadow-black/[0.06] backdrop-blur-sm";

export const landingCardClassName =
  "rounded-3xl bg-white/75 p-8 shadow-lg shadow-black/[0.06] backdrop-blur-sm sm:p-10";

export const landingFieldClassName =
  "rounded-2xl border-0 bg-foreground/[0.04] shadow-inner shadow-black/[0.03] focus-visible:border-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand-sky/40";

export const landingButtonSecondaryClassName =
  "rounded-2xl border-0 bg-brand-peach/80 shadow-sm shadow-brand-peach/30 hover:bg-brand-peach hover:shadow-md hover:shadow-brand-peach/35 focus-visible:ring-brand-peach/50 active:translate-y-0";

export const appPageBackgrounds = {
  list: "bg-brand-sky/30",
  new: "bg-brand-peach/25",
  editor: "bg-brand-lilac/20",
  edit: "bg-brand-yellow/30",
  preview: "bg-brand-pink/25",
  profile: "bg-brand-sage/30",
} as const;

export type AppPageBackground = keyof typeof appPageBackgrounds;

export const appPageMainClassName =
  "mx-auto w-full max-w-6xl flex-1 px-6 py-12 lg:py-16";

export const appPageMainNarrowClassName =
  "mx-auto w-full max-w-4xl flex-1 px-6 py-12 lg:py-16";

export const appPageTitleClassName =
  "font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl";

export const appBackLinkClassName =
  "text-sm text-foreground/70 transition-colors hover:text-foreground hover:underline";
