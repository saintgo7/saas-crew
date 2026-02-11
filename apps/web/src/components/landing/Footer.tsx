'use client'

import Link from 'next/link'
import { useTranslations } from '@/i18n/LanguageContext'

const footerSections = [
  {
    titleKey: 'footer.navigation',
    links: [
      { key: 'nav.projects', href: '/projects' },
      { key: 'nav.courses', href: '/courses' },
      { key: 'nav.community', href: '/community' },
      { key: 'nav.leaderboard', href: '/leaderboard' },
    ],
  },
  {
    titleKey: 'footer.resources',
    links: [
      { key: 'nav.glossary', href: '/glossary' },
      { key: 'nav.qna', href: '/qna' },
      { key: 'nav.mentoring', href: '/mentoring' },
      { key: 'nav.chat', href: '/chat' },
    ],
  },
  {
    titleKey: 'footer.connect',
    links: [
      { key: 'footer.github', href: 'https://github.com/saintgo7/saas-crew', external: true },
    ],
  },
] as const

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="border-t py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-lg font-bold text-white">W</span>
              </div>
              <span className="text-lg font-semibold">WKU Software Crew</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.aboutDescription')}
            </p>
          </div>

          {/* Navigation sections */}
          {footerSections.map((section) => (
            <div key={section.titleKey} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t(section.titleKey)}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => {
                  const isExternal = 'external' in link && link.external
                  return (
                    <li key={link.key}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {t(link.key)}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {t(link.key)}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('footer.university')}
          </p>
        </div>
      </div>
    </footer>
  )
}
