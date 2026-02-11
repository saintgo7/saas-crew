'use client'

import { motion } from 'framer-motion'
import { UserPlus, Rocket, Zap, TrendingUp } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, viewportOnce } from '@/lib/motion'

const steps = [
  { key: 'step1', icon: UserPlus, color: 'bg-blue-500' },
  { key: 'step2', icon: Rocket, color: 'bg-emerald-500' },
  { key: 'step3', icon: Zap, color: 'bg-amber-500' },
  { key: 'step4', icon: TrendingUp, color: 'bg-purple-500' },
] as const

export function HowItWorksSection() {
  const t = useTranslations()

  return (
    <section className="py-24 px-6 section-gradient-dark">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-heading-xl md:text-display text-center mb-16"
        >
          {t('home.howItWorks.title')}
        </motion.h2>

        <div className="relative">
          {/* Vertical line connector */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-12 md:space-y-16"
          >
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={step.key}
                  variants={isLeft ? fadeInLeft : fadeInRight}
                  className="relative"
                >
                  {/* Mobile layout */}
                  <div className="md:hidden flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center text-lg font-bold shadow-lg`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t(`home.howItWorks.${step.key}.title`)}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(`home.howItWorks.${step.key}.description`)}
                      </p>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
                    <div className={isLeft ? 'text-right' : 'order-3 text-left'}>
                      <h3 className="font-semibold text-lg">{t(`home.howItWorks.${step.key}.title`)}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(`home.howItWorks.${step.key}.description`)}
                      </p>
                    </div>
                    <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center text-lg font-bold shadow-lg ${isLeft ? '' : 'order-2'}`}>
                      {index + 1}
                    </div>
                    <div className={isLeft ? 'order-3' : ''}>
                      <div className="w-12 h-12 rounded-xl bg-card border flex items-center justify-center">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
