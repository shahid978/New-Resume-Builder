import { SiteNav } from "./components/landing/site-nav";
import { Hero } from "./components/landing/hero";
import { Features } from "./components/landing/features";
import { HowItWorks } from "./components/landing/how-it-works";
import { Pricing } from "./components/landing/pricing";
import { Faq } from "./components/landing/faq";
import { Cta } from "./components/landing/cta";
import { Footer } from "./components/landing/footer";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
