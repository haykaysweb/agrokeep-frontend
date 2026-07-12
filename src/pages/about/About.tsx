import AboutUs from "@/components/about/AboutUs";
import CTASection from "@/components/about/CTASection";
import ForFarmers from "@/components/about/ForFarmers";
import OurStory from "@/components/about/OurStory";
import StatsSection from "@/components/about/StatsSection";
import WhatGuidesUs from "@/components/about/WhatGuidesUs";
import WhyAgroKeep from "@/components/about/WhyAgroKeep";
export default function About() {
  return (
    <>
      <AboutUs />
      <OurStory/>
      <WhatGuidesUs/>
      <WhyAgroKeep/>
      <ForFarmers/>
      <StatsSection/>
      <CTASection/>
    </>
  );
}
