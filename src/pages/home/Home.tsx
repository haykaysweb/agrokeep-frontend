import BestServiceAndPlan from "@/components/home/BestServiceAndPlan";
import ForFarmers from "@/components/home/ForFarmers";
import FrqAskedQuestions from "@/components/home/FrqAskedQuestions";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import HubPartner from "@/components/home/HubPartner";
import Stories from "@/components/home/Stories";
import VerifyHubs from "@/components/home/VerifyHubs";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BestServiceAndPlan />
      <HowItWorks />
      <VerifyHubs />
      <ForFarmers />
      <Stories />
      <FrqAskedQuestions />
      <HubPartner />
    </main>
  );
}
