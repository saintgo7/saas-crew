'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Home, FolderGit2, BookOpen, MessageSquare, LayoutDashboard, User, LogOut, ChevronDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslations } from '@/i18n/LanguageContext'
import { useUserStore } from '@/store/user-store'

const navigationKeys = [
  { key: 'home', href: '/', icon: Home },
  { key: 'projects', href: '/projects', icon: FolderGit2 },
  { key: 'courses', href: '/courses', icon: BookOpen },
  { key: 'community', href: '/community', icon: MessageSquare },
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()
  const { user, clearUser } = useUserStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
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

          {user ? (
            // User Menu Dropdown
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

              {isDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {/* User Info */}
                  <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>

                  {/* Menu Items */}
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

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('common.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Login Button
            <Link
              href="/auth/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {t('common.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
