"use client";

import { useTranslations } from "next-intl";
import { cmDownloadBtnClassName } from "@/lib/colorminutes-public-styles";

export function PrintMinutesButton() {
  const t = useTranslations("meetings");

  return (
    <button type="button" onClick={() => window.print()} className={cmDownloadBtnClassName}>
      {t("printMinutes")}
    </button>
  );
}
