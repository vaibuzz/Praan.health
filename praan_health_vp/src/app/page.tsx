import { HeroCinematic } from "@/components/home/HeroCinematic";
import { EmotionalScroll } from "@/components/home/EmotionalScroll";
import { FeatureStack } from "@/components/home/FeatureStack";
import { WhyFamilies } from "@/components/home/WhyFamilies";
import { MetricsReveal } from "@/components/home/MetricsReveal";
import { ProgramsHorizontal } from "@/components/home/ProgramsHorizontal";
import { DashboardShowcase } from "@/components/home/DashboardShowcase";
import { TestimonialsReel } from "@/components/home/TestimonialsReel";
import { TrustSection } from "@/components/home/TrustSection";
import { CommunityBanner } from "@/components/home/CommunityBanner";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <HeroCinematic />
      <EmotionalScroll />
      <FeatureStack />
      <WhyFamilies />
      <MetricsReveal />
      <ProgramsHorizontal />
      <DashboardShowcase />
      <TestimonialsReel />
      <TrustSection />
      <CommunityBanner />
      <FinalCTA />
    </>
  );
}
