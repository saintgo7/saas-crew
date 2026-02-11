'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

export function HeroSection() {
  const t = useTranslations()

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{ backgroundImage: 'url(/grid.svg)', backgroundSize: '40px 40px' }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <motion.div
        className="relative max-w-5xl text-center space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        viewport={viewportOnce}
      >
        <motion.div variants={fadeInUp}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            {t('home.badge')}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-display md:text-display-lg lg:text-display-xl"
        >
          {t('home.title')}
          <br />
          <span className="text-gradient">{t('home.titleHighlight')}</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-body-lg text-muted-foreground max-w-2xl mx-auto"
        >
          {t('home.description')}
          <br className="hidden md:block" />
          {t('home.descriptionSub')}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            {t('home.startWithGithub')}
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl border-2 border-input bg-background hover:bg-accent transition-all hover:-translate-y-0.5"
          >
            {t('home.browseProjects')}
          </Link>
        </motion.div>

        {/* Platform preview placeholder */}
        <motion.div
          variants={fadeInUp}
          className="relative mt-12 mx-auto max-w-4xl"
        >
          <div className="rounded-2xl border bg-card/50 backdrop-blur shadow-2xl overflow-hidden aspect-video">
            <div className="w-full h-full bg-gradient-to-br from-primary/5 to-indigo-500/5 flex items-center justify-center">
              <div className="text-center space-y-3 px-6">
                <div className="flex justify-center gap-3">
                  {['bg-green-400', 'bg-yellow-400', 'bg-blue-400'].map((color, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${color} opacity-60`} />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">
                  {t('home.badge')}
                </p>
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </motion.div>
    </section>
  )
}
