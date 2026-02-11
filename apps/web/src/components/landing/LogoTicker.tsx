'use client'

import { motion } from 'framer-motion'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, viewportOnce } from '@/lib/motion'

const techLogos = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#000000' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Python', color: '#3776AB' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'PostgreSQL', color: '#4169E1' },
  { name: 'GitHub', color: '#181717' },
]

function LogoItem({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-card/50 border border-border/50 whitespace-nowrap">
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: color }}
      >
        {name[0]}
      </div>
      <span className="text-sm font-medium text-muted-foreground">{name}</span>
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
      className="py-16 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
          {t('home.techStack')}
        </p>
        <div className="relative">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

          <div className="flex animate-ticker">
            <div className="flex gap-4 pr-4">
              {techLogos.map((logo) => (
                <LogoItem key={logo.name} {...logo} />
              ))}
            </div>
            <div className="flex gap-4 pr-4">
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
