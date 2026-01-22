'use client'

import Link from 'next/link'
import { Target, Users, Rocket, Award } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

export default function AboutPage() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:border-gray-700 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.mission.title')}</h2>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {t('about.mission.description')}
          </p>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            {t('about.features.title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Level System */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {t('about.features.levelSystem.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.features.levelSystem.description')}
              </p>
            </div>

            {/* Project Management */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {t('about.features.projectManagement.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.features.projectManagement.description')}
              </p>
            </div>

            {/* Community */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {t('about.features.community.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.features.community.description')}
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            {t('about.howItWorks.title')}
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                1
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {t('about.howItWorks.step1.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.howItWorks.step1.description')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                2
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {t('about.howItWorks.step2.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.howItWorks.step2.description')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                3
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {t('about.howItWorks.step3.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.howItWorks.step3.description')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                4
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {t('about.howItWorks.step4.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.howItWorks.step4.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            {t('common.startNow')}
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {t('common.wkuStudentOnly')}
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t('common.joinCrew')}
          </Link>
        </div>
      </div>
    </div>
  )
}
