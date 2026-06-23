import { HeroSection } from "@/features/landing/components/HeroSection"
import { AhaMomentSection } from "@/features/landing/components/AhaMomentSection"
import { EdgeComputingSection } from "@/features/landing/components/EdgeComputingSection"
import { FeaturesSection } from "@/features/landing/components/FeaturesSection"
import { LandingFooter } from "@/components/layout/LandingFooter"

export default function LandingPage() {
  return (
    <div id="top" className="w-full bg-white">
      <HeroSection />
      <AhaMomentSection />
      <EdgeComputingSection />
      <FeaturesSection />
      <LandingFooter />
    </div>
  )
}
