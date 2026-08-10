import BestServiceAndPlan from "@/pages/home/BestServiceAndPlan";
import ForFarmers from "@/pages/home/ForFarmers";
import FrqAskedQuestions from "@/pages/home/FrqAskedQuestions";
import HeroSection from "@/pages/home/HeroSection";
import HowItWorks from "@/pages/home/HowItWorks";
import HubPartner from "@/pages/home/HubPartner";
import Stories from "@/pages/home/Stories";
import VerifyHubs from "@/pages/home/VerifyHubs";

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
