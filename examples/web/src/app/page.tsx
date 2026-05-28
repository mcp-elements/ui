import { HeroSection } from '@/components/home/HeroSection'
import { ProofStrip } from '@/components/home/ProofStrip'
import { FeatureCards } from '@/components/home/FeatureCards'
import { ComponentShowcase } from '@/components/home/ComponentShowcase'
import { McpSection } from '@/components/home/McpSection'
import { FrameworkSection } from '@/components/home/FrameworkSection'
import { CopyPasteCta } from '@/components/home/CopyPasteCta'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProofStrip />
      <FeatureCards />
      <ComponentShowcase />
      <McpSection />
      <FrameworkSection />
      <CopyPasteCta />
    </>
  )
}
