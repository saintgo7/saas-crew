'use client'

import { motion } from 'framer-motion'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, viewportOnce } from '@/lib/motion'

const techLogos = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#000000' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#339933' },
  { name: 'NestJS', color: '#E0234E' },
  { name: 'Python', color: '#3776AB' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'PostgreSQL', color: '#4169E1' },
  { name: 'Redis', color: '#DC382D' },
  { name: 'GitHub', color: '#181717' },
]

function LogoItem({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-2.5 whitespace-nowrap">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: color }}
      >
        {name[0]}
      </div>
      <span className="text-sm font-medium text-gray-400">{name}</span>
    </div>
  )
}

export function LogoTicker() {
  const t = useTranslations()

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeInUp}
      className="py-12 px-6 overflow-hidden bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
          {t('home.techStack')}
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10" />

          <div className="flex animate-ticker">
            <div className="flex gap-2 pr-2">
              {techLogos.map((logo) => (
                <LogoItem key={logo.name} {...logo} />
              ))}
            </div>
            <div className="flex gap-2 pr-2">
              {techLogos.map((logo) => (
                <LogoItem key={`dup-${logo.name}`} {...logo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
