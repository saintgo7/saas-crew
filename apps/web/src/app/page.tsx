'use client'

import Link from 'next/link'
import { useTranslations } from '@/i18n/LanguageContext'

export default function HomePage() {
  const t = useTranslations()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl text-center space-y-8">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {t('home.badge')}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            {t('home.title')}
            <br />
            <span className="text-primary">{t('home.titleHighlight')}</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('home.description')}
            <br className="hidden md:block" />
            {t('home.descriptionSub')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t('home.startWithGithub')}
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border border-input bg-background hover:bg-accent transition-colors"
            >
              {t('home.browseProjects')}
            </Link>
          </div>
        </div>
      </section>

      {/* Level System */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.levelSystem.title')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('home.levelSystem.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Junior */}
            <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-6">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium dark:bg-green-900/30 dark:text-green-400">
                  {t('home.levelSystem.junior.level')}
                </span>
              </div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">{t('home.levelSystem.junior.name')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('home.levelSystem.junior.description')}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {t('home.levelSystem.junior.feature1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {t('home.levelSystem.junior.feature2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {t('home.levelSystem.junior.feature3')}
                  </li>
                </ul>
              </div>
            </div>

            {/* Senior */}
            <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-6">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium dark:bg-blue-900/30 dark:text-blue-400">
                  {t('home.levelSystem.senior.level')}
                </span>
              </div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">{t('home.levelSystem.senior.name')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('home.levelSystem.senior.description')}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {t('home.levelSystem.senior.feature1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {t('home.levelSystem.senior.feature2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {t('home.levelSystem.senior.feature3')}
                  </li>
                </ul>
              </div>
            </div>

            {/* Master */}
            <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-6">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium dark:bg-purple-900/30 dark:text-purple-400">
                  {t('home.levelSystem.master.level')}
                </span>
              </div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold mb-2 text-purple-600 dark:text-purple-400">{t('home.levelSystem.master.name')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('home.levelSystem.master.description')}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {t('home.levelSystem.master.feature1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {t('home.levelSystem.master.feature2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {t('home.levelSystem.master.feature3')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            {t('home.howItWorks.title')}
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold">{t('home.howItWorks.step1.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('home.howItWorks.step1.description')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold">{t('home.howItWorks.step2.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('home.howItWorks.step2.description')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold">{t('home.howItWorks.step3.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('home.howItWorks.step3.description')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold">{t('home.howItWorks.step4.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('home.howItWorks.step4.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('common.startNow')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('common.wkuStudentOnly')}
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t('common.joinCrew')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              {t('footer.about')}
            </Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">
              {t('footer.projects')}
            </Link>
            <a
              href="https://github.com/saintgo7/saas-crew"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {t('footer.github')}
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
