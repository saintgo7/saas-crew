'use client'

import { motion } from 'framer-motion'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

const levels = [
  {
    key: 'junior',
    color: 'green',
    glowColor: 'rgba(34, 197, 94, 0.15)',
    dotColor: 'bg-green-500',
    badgeBg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    titleColor: 'text-green-600 dark:text-green-400',
    borderHover: 'hover:border-green-500/30',
  },
  {
    key: 'senior',
    color: 'blue',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    dotColor: 'bg-blue-500',
    badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    titleColor: 'text-blue-600 dark:text-blue-400',
    borderHover: 'hover:border-blue-500/30',
  },
  {
    key: 'master',
    color: 'purple',
    glowColor: 'rgba(168, 85, 247, 0.15)',
    dotColor: 'bg-purple-500',
    badgeBg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    titleColor: 'text-purple-600 dark:text-purple-400',
    borderHover: 'hover:border-purple-500/30',
  },
] as const

export function LevelSystemSection() {
  const t = useTranslations()

  return (
    <section className="py-24 px-6 section-gradient-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-heading-xl md:text-display mb-4">
            {t('home.levelSystem.title')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body-lg text-muted-foreground">
            {t('home.levelSystem.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid md:grid-cols-3 gap-8"
        >
          {levels.map((level) => (
            <motion.div
              key={level.key}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`relative p-8 rounded-2xl border bg-card transition-colors ${level.borderHover}`}
              style={{
                boxShadow: `0 0 0 0 ${level.glowColor}`,
              }}
            >
              <div className="absolute -top-4 left-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${level.badgeBg}`}>
                  {t(`home.levelSystem.${level.key}.level`)}
                </span>
              </div>
              <div className="pt-4">
                <h3 className={`text-2xl font-bold mb-2 ${level.titleColor}`}>
                  {t(`home.levelSystem.${level.key}.name`)}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t(`home.levelSystem.${level.key}.description`)}
                </p>
                <ul className="space-y-2 text-sm">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${level.dotColor}`} />
                      {t(`home.levelSystem.${level.key}.feature${i}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
