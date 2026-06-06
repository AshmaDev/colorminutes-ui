import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomeHero } from "@/components/home/home-hero";
import { HomeOptions } from "@/components/home/home-options";
import { HomePublish } from "@/components/home/home-publish";
import { HomePricing } from "@/components/home/home-pricing";
import { HomeFaq } from "@/components/home/home-faq";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground">
      <SiteHeader variant="landing" />
      <main className="flex flex-1 flex-col">
        <HomeHero />
        <HomeOptions />
        <HomePublish />
        <HomePricing />
        <HomeFaq />
      </main>
      <SiteFooter variant="landing" />
    </div>
  );
}
