import { HeroSection } from '@/components/home/HeroSection'
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
      <WhatIsMcpSection />
      <ProofStrip />
      <ComponentShowcase />
      <FeatureCards />
      <FrameworkSection />
      <CopyPasteCta />
    </>
  )
}
