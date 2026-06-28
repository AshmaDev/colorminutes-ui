import type { SectionColor } from "@/lib/schemas";

export type CmGradient = SectionColor;

export const cmPageClassName = "cm-public min-h-full";

export const cmWrapClassName =
  "mx-auto w-[min(1100px,calc(100%-24px))] pb-[220px] pt-[18px] max-md:w-[min(100%-14px,1000px)] max-md:pb-[250px]";

export const cmHeroClassName = "cm-hero relative mt-2.5 overflow-hidden rounded-[30px] max-md:rounded-3xl";

export const cmSectionClassName =
  "cm-section scroll-mt-[88px] overflow-hidden rounded-[24px] border border-white/85 bg-[rgba(255,255,255,0.92)] shadow-[0_14px_40px_rgba(26,39,68,0.12)]";

export const cmContentSectionsClassName = "mt-10 flex flex-col gap-8";

export const cmSectionHeadClassName = "px-[18px] pb-2.5 pt-[18px] max-md:px-3.5";

export const cmSectionBodyClassName = "px-[18px] pb-[18px] pt-2 max-md:px-3.5";

export const cmBoxClassName =
  "cm-box mt-3 rounded-[18px] border border-white/80 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] first:mt-0 [&+&]:mt-2.5 [&_h3]:mb-2 [&_h3]:mt-0 [&_h3]:text-base [&_li]:text-[0.97rem] [&_li]:text-[#243042] [&_p]:text-[0.97rem] [&_p]:text-[#243042] [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-[18px]";

export const cmMiniCardClassName =
  "rounded-[20px] border border-[rgba(229,231,235,0.9)] bg-[rgba(255,255,255,0.7)] p-3.5 backdrop-blur-[6px]";

export const cmMeetingDateClassName =
  "relative z-[1] mt-2.5 inline-block rounded-full border border-[rgba(229,231,235,0.9)] bg-[rgba(255,255,255,0.8)] px-3 py-2 text-[0.92rem] text-[#374151]";

export const cmDownloadBtnClassName =
  "no-print inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(17,24,39,0.92)] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(17,24,39,0.16)] transition-opacity hover:opacity-90";

export const cmFooterClassName =
  "mt-5 px-5 py-5 text-center text-[0.9rem] text-[#6b7280]";

export function cmGradientClass(color: SectionColor): string {
  return `cm-gradient-${color}`;
}
