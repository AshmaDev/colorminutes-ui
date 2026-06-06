import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HomeSectionLabel } from "@/components/home/home-section-label";
import { HomeSectionTitle } from "@/components/home/home-section-title";

type AuthPageAsideProps = {
  variant: "login" | "register";
};

export async function AuthPageAside({ variant }: AuthPageAsideProps) {
  const t = await getTranslations(`auth.${variant}Page`);

  return (
    <div className="space-y-8">
      <HomeSectionLabel>{t("badge")}</HomeSectionLabel>
      <HomeSectionTitle as="h1">
        {t("headline")}{" "}
        <span className="italic">{t("headlineHighlight")}</span>
      </HomeSectionTitle>
      <p className="max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
        {t("description")}
      </p>
      <p className="text-sm text-foreground/70">
        <Link href="/" className="font-medium text-foreground underline-offset-4 hover:underline">
          {t("backToHome")}
        </Link>
      </p>
    </div>
  );
}
