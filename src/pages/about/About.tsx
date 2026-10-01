import Seo from "@/components/Seo";
import AboutHero from "./AboutHero";
import CTASection from "./CTASection";
import ForFarmers from "./ForFarmers";
import OurStory from "./OurStory";
import StatsSection from "./StatsSection";
import WhatGuidesUs from "./WhatGuidesUs";
import WhyAgroKeep from "./WhyAgroKeep";
export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="Learn how AgroKeep connects Nigerian farmers with verified agricultural storage hubs to reduce post-harvest losses and protect your harvest."
      />
      <section className="bg-backgroundTwo">
        <AboutHero />
        <OurStory />
        <WhatGuidesUs />
        <WhyAgroKeep />
        <ForFarmers />
        <StatsSection />
        <CTASection />
      </section>
    </>
  );
}
