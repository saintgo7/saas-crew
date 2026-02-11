'use client'

import { motion } from 'framer-motion'
import { FolderGit2, BookOpen, Users } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInLeft, fadeInRight, staggerContainer, viewportOnce } from '@/lib/motion'

const features = [
  {
    key: 'projects',
    icon: FolderGit2,
    color: 'blue',
  },
  {
    key: 'learning',
    icon: BookOpen,
    color: 'emerald',
  },
  {
    key: 'community',
    icon: Users,
    color: 'violet',
  },
] as const

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    gradient: 'from-blue-500/10 to-indigo-500/10',
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    gradient: 'from-emerald-500/10 to-teal-500/10',
  },
  violet: {
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800',
    gradient: 'from-violet-500/10 to-purple-500/10',
  },
}

export function FeatureShowcase() {
  const t = useTranslations()

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-24">
        {features.map((feature, index) => {
          const colors = colorMap[feature.color]
          const Icon = feature.icon
          const isReversed = index % 2 !== 0

          return (
            <motion.div
              key={feature.key}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}
            >
              {/* Text content */}
              <motion.div
                variants={isReversed ? fadeInRight : fadeInLeft}
                className="flex-1 space-y-6"
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border}`}>
                  <Icon className={`h-4 w-4 ${colors.text}`} />
                  <span className={`text-sm font-medium ${colors.text}`}>
                    {t(`home.features.${feature.key}.badge`)}
                  </span>
                </div>
                <h3 className="text-heading-xl">
                  {t(`home.features.${feature.key}.title`)}
                </h3>
                <p className="text-body-lg text-muted-foreground">
                  {t(`home.features.${feature.key}.description`)}
                </p>
              </motion.div>

              {/* Visual placeholder */}
              <motion.div
                variants={isReversed ? fadeInLeft : fadeInRight}
                className="flex-1 w-full"
              >
                <div className={`rounded-2xl border bg-gradient-to-br ${colors.gradient} aspect-[4/3] flex items-center justify-center`}>
                  <Icon className={`h-16 w-16 ${colors.text} opacity-30`} />
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
