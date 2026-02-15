'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
      className="py-24 px-6 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <motion.h2
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
        >
          {t('home.cta.title')}
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-lg text-gray-500 dark:text-gray-400"
        >
          {t('home.cta.description')}
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
          >
            {t('common.joinCrew')}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline transition-all"
          >
            {t('home.browseProjects')}
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}
