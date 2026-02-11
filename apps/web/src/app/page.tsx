'use client'

import {
  HeroSection,
  LogoTicker,
  FeatureShowcase,
  LevelSystemSection,
  StatsSection,
  HowItWorksSection,
  MemberShowcase,
  CTASection,
  Footer,
} from '@/components/landing'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <LogoTicker />
      <FeatureShowcase />
      <LevelSystemSection />
      <StatsSection />
      <HowItWorksSection />
      <MemberShowcase />
      <CTASection />
      <Footer />
    </main>
  )
}
