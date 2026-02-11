'use client'

import {
  HeroSection,
  LogoTicker,
  FeatureShowcase,
  CTASection,
  Footer,
} from '@/components/landing'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <LogoTicker />
      <FeatureShowcase />
      <CTASection />
      <Footer />
    </main>
  )
}
