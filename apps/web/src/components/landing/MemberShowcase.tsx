'use client'

import { motion } from 'framer-motion'
import { KanbanSquare, MessagesSquare, Trophy } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

const showcaseItems = [
  { icon: KanbanSquare, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  { icon: MessagesSquare, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: Trophy, color: 'text-violet-500', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
] as const

export function MemberShowcase() {
  const t = useTranslations()

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-heading-xl md:text-display mb-4">
            {t('home.memberShowcase.title')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body-lg text-muted-foreground">
            {t('home.memberShowcase.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid md:grid-cols-3 gap-6"
        >
          {showcaseItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.bgColor} mb-4`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {t(`home.memberShowcase.item${index + 1}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`home.memberShowcase.item${index + 1}.description`)}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
