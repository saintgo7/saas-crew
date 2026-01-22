'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderGit2, BookOpen, MessageSquare, LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslations } from '@/i18n/LanguageContext'

const navigationKeys = [
  { key: 'home', href: '/', icon: Home },
  { key: 'projects', href: '/projects', icon: FolderGit2 },
  { key: 'courses', href: '/courses', icon: BookOpen },
  { key: 'community', href: '/community', icon: MessageSquare },
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
]

export function Header() {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700 dark:bg-gray-900/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-bold text-white">W</span>
          </div>
          <span className="hidden text-lg font-semibold text-gray-900 dark:text-white sm:inline-block">
            WKU Software Crew
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navigationKeys.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{t(`nav.${item.key}`)}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right Section: Theme, Language, Auth */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link
            href="/auth/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t('common.login')}
          </Link>
        </div>
      </div>
    </header>
  )
}
