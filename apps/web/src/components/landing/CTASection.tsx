'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

export function CTASection() {
  const t = useTranslations()

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="py-24 px-6"
    >
      <div className="max-w-4xl mx-auto relative">
        <div className="rounded-3xl section-gradient-hero p-12 md:p-16 text-center text-white overflow-hidden relative">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative space-y-6">
            <motion.h2
              variants={fadeInUp}
              className="text-heading-xl md:text-display font-bold"
            >
              {t('common.startNow')}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/80 max-w-lg mx-auto"
            >
              {t('common.wkuStudentOnly')}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-0.5"
              >
                {t('common.joinCrew')}
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl border-2 border-white/30 text-white hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                {t('home.browseProjects')}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
