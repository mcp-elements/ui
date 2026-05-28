import { HeroSection } from '@/components/home/HeroSection'
import { FlagshipScene } from '@/components/home/FlagshipScene'
import { BeforeAfterSection } from '@/components/home/BeforeAfterSection'
import { WhatIsMcpSection } from '@/components/home/WhatIsMcpSection'
import { ProofStrip } from '@/components/home/ProofStrip'
import { ComponentShowcase } from '@/components/home/ComponentShowcase'
import { FeatureCards } from '@/components/home/FeatureCards'
import { FrameworkSection } from '@/components/home/FrameworkSection'
import { CopyPasteCta } from '@/components/home/CopyPasteCta'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FlagshipScene />
      <BeforeAfterSection />
      <WhatIsMcpSection />
      <ProofStrip />
      <ComponentShowcase />
      <FeatureCards />
      <FrameworkSection />
      <CopyPasteCta />
    </>
  )
}
