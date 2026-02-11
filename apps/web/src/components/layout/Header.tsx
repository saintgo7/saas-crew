'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderGit2, BookOpen, BookText, HelpCircle, MessageSquare, MessagesSquare, Users, Trophy, LayoutDashboard, User, LogOut, ChevronDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileNav } from './MobileNav'
import { NotificationDropdown } from '@/components/notifications'
import { useTranslations } from '@/i18n/LanguageContext'
import { useUserStore } from '@/store/user-store'
import type { LucideIcon } from 'lucide-react'

interface NavChild {
  key: string
  href: string
  icon: LucideIcon
}

interface NavGroupDirect {
  key: string
  href: string
  icon: LucideIcon
  authRequired?: boolean
}

interface NavGroupDropdown {
  key: string
  icon: LucideIcon
  children: NavChild[]
}

type NavGroup = NavGroupDirect | NavGroupDropdown

const navGroups: NavGroup[] = [
  {
    key: 'projects',
    href: '/projects',
    icon: FolderGit2,
  },
  {
    key: 'learn',
    icon: BookOpen,
    children: [
      { key: 'courses', href: '/courses', icon: BookOpen },
      { key: 'glossary', href: '/glossary', icon: BookText },
      { key: 'qna', href: '/qna', icon: HelpCircle },
    ],
  },
  {
    key: 'community',
    icon: MessageSquare,
    children: [
      { key: 'community', href: '/community', icon: MessageSquare },
      { key: 'chat', href: '/chat', icon: MessagesSquare },
      { key: 'mentoring', href: '/mentoring', icon: Users },
    ],
  },
  {
    key: 'leaderboard',
    href: '/leaderboard',
    icon: Trophy,
  },
  {
    key: 'dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    authRequired: true,
  },
]

function isDropdown(group: NavGroup): group is NavGroupDropdown {
  return 'children' in group
}

function NavDropdown({ group }: { group: NavGroupDropdown }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations()
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const Icon = group.icon

  const hasActiveChild = group.children.some(
    (child) => pathname === child.href || pathname.startsWith(child.href)
  )

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          hasActiveChild
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
        }`}
      >
        <Icon className="h-4 w-4" />
        <span>{t(`nav.${group.key}`)}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border bg-popover p-2 shadow-lg"
          >
            {group.children.map((child) => {
              const ChildIcon = child.icon
              const isActive = pathname === child.href || pathname.startsWith(child.href)
              return (
                <Link
                  key={child.key}
                  href={child.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-popover-foreground hover:bg-accent'
                  }`}
                >
                  <ChildIcon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{t(`nav.${child.key}`)}</div>
                    <div className="text-xs text-muted-foreground">{t(`nav.${child.key}Description`)}</div>
                  </div>
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()
  const { user, clearUser } = useUserStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    clearUser()
    setIsDropdownOpen(false)
    router.push('/')
  }

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navGroups.map((group) => {
            if ('authRequired' in group && group.authRequired && !user) return null

            if (isDropdown(group)) {
              return <NavDropdown key={group.key} group={group} />
            }

            const isActive = pathname === group.href ||
              (group.href !== '/' && pathname.startsWith(group.href))
            const Icon = group.icon

            return (
              <Link
                key={group.key}
                href={group.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{t(`nav.${group.key}`)}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <NotificationDropdown />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                {user.profileImage || user.avatar ? (
                  <img
                    src={user.profileImage || user.avatar}
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                    <User className="h-3 w-3 text-white" />
                  </div>
                )}
                <span className="hidden max-w-[100px] truncate text-sm font-medium text-gray-700 dark:text-gray-300 sm:inline-block">
                  {user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4" />
                      {t('profile.title')}
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {t('nav.dashboard')}
                    </Link>

                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('common.logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {t('common.login')}
            </Link>
          )}

          {/* Mobile hamburger */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
