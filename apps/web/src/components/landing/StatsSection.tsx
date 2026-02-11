'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, FolderGit2, BookOpen, GitCommitHorizontal } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame: number
    const duration = 1500
    const start = performance.now()

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target, inView])

  return count
}

const stats = [
  { key: 'members', icon: Users, value: 10, suffix: '+' },
  { key: 'projects', icon: FolderGit2, value: 5, suffix: '+' },
  { key: 'courses', icon: BookOpen, value: 3, suffix: '+' },
  { key: 'commits', icon: GitCommitHorizontal, value: 500, suffix: '+' },
] as const

function StatItem({ statKey, icon: Icon, value, suffix }: { statKey: string; icon: typeof Users; value: number; suffix: string }) {
  const t = useTranslations()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const count = useCounter(value, isInView)

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      className="text-center space-y-3"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mx-auto">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-display font-bold">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-sm text-muted-foreground font-medium">
        {t(`home.stats.${statKey}`)}
      </p>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="py-24 px-6"
    >
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat) => (
          <StatItem
            key={stat.key}
            statKey={stat.key}
            icon={stat.icon}
            value={stat.value}
            suffix={stat.suffix}
          />
        ))}
      </div>
    </motion.section>
  )
}
