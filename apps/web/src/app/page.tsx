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
    <main className="min-h-screen landing-light">
      <HeroSection />
      <LogoTicker />
      <FeatureShowcase />
      <CTASection />
      <Footer />
    </main>
  )
}
