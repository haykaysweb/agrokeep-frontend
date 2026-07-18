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
