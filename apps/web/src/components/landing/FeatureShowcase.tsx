'use client'

import { motion } from 'framer-motion'
import { FolderGit2, BookOpen, Users, BarChart3, MessageSquare, Layout } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

const features = [
  {
    key: 'projects',
    icon: FolderGit2,
    mockupIcons: [Layout, BarChart3, Users],
  },
  {
    key: 'learning',
    icon: BookOpen,
    mockupIcons: [BookOpen, BarChart3, MessageSquare],
  },
  {
    key: 'community',
    icon: Users,
    mockupIcons: [MessageSquare, Users, Layout],
  },
] as const

function FeatureMockup({ icons }: { icons: readonly (typeof FolderGit2)[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        </div>
      </div>
      <div className="p-5 space-y-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="flex gap-2">
            {icons.map((Icon, i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <Icon className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-white border border-gray-200 space-y-2">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-3/4 rounded bg-gray-100" />
              <div className="h-2 w-1/2 rounded bg-gray-100" />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="flex-1 p-2 rounded-lg bg-white border border-gray-200">
            <div className="h-2 w-8 rounded bg-gray-200 mb-1.5" />
            <div className="h-4 w-12 rounded bg-blue-50" />
          </div>
          <div className="flex-1 p-2 rounded-lg bg-white border border-gray-200">
            <div className="h-2 w-8 rounded bg-gray-200 mb-1.5" />
            <div className="h-4 w-12 rounded bg-green-50" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeatureShowcase() {
  const t = useTranslations()

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="max-w-3xl mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {t('home.features.sectionTitle')}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-500"
          >
            {t('home.features.sectionDescription')}
          </motion.p>
        </motion.div>

        {/* Feature items */}
        <div className="space-y-32">
          {features.map((feature, index) => {
            const isReversed = index % 2 !== 0

            return (
              <motion.div
                key={feature.key}
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-16`}
              >
                <motion.div
                  variants={fadeInUp}
                  className="flex-1 space-y-4"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {t(`home.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-lg text-gray-500 leading-relaxed">
                    {t(`home.features.${feature.key}.description`)}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex-1 w-full"
                >
                  <FeatureMockup icons={feature.mockupIcons} />
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
