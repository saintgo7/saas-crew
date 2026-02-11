'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { fadeInUp, staggerContainer } from '@/lib/motion'

export function HeroSection() {
  const t = useTranslations()

  return (
    <section className="bg-white pt-32 pb-16 px-6">
      <motion.div
        className="max-w-5xl mx-auto text-center space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
        >
          {t('home.title')}{' '}
          {t('home.titleHighlight')}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed"
        >
          {t('home.description')} {t('home.descriptionSub')}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
        >
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all"
          >
            {t('home.startWithGithub')}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 hover:underline transition-all"
          >
            {t('home.browseProjects')}
          </Link>
        </motion.div>

        {/* Product screenshot mockup */}
        <motion.div
          variants={fadeInUp}
          className="relative mt-12 mx-auto max-w-5xl"
        >
          <div className="rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-6 rounded-md bg-gray-200 max-w-md mx-auto" />
              </div>
            </div>
            {/* Kanban board mockup */}
            <div className="p-6 bg-gray-50 min-h-[320px] md:min-h-[400px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-5 w-24 rounded bg-gray-200" />
                <div className="text-xs text-gray-400">{'>'}</div>
                <div className="h-5 w-32 rounded bg-blue-50 text-blue-600 text-xs flex items-center px-2 font-medium">
                  {t('nav.projects')}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['To Do', 'In Progress', 'Review', 'Done'].map((col, ci) => (
                  <div key={col} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{col}</span>
                      <span className="text-xs text-gray-400">{3 - ci}</span>
                    </div>
                    {Array.from({ length: Math.max(1, 3 - ci) }).map((_, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-white border border-gray-200 space-y-2"
                      >
                        <div className="h-3 w-full rounded bg-gray-200" />
                        <div className="h-3 w-2/3 rounded bg-gray-100" />
                        <div className="flex gap-1.5 pt-1">
                          <div className={`h-4 w-12 rounded-full text-[10px] flex items-center justify-center font-medium ${
                            ci === 0 ? 'bg-gray-100 text-gray-500' :
                            ci === 1 ? 'bg-blue-50 text-blue-600' :
                            ci === 2 ? 'bg-yellow-50 text-yellow-600' :
                            'bg-green-50 text-green-600'
                          }`}>
                            {ci === 0 ? 'task' : ci === 1 ? 'dev' : ci === 2 ? 'review' : 'done'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
