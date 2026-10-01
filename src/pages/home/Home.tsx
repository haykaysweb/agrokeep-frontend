import Seo from "@/components/Seo";
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
      <Seo
        title="AgroKeep | Secure Agricultural Storage Hubs in Nigeria"
        description="Connect with verified crop storage hubs across Nigeria. Protect your harvest, reduce post-harvest losses, and easily book reliable storage space."
      />
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
