'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, FolderGit2, BookOpen, BookText, HelpCircle, MessageSquare, MessagesSquare, Users, Trophy, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { useUserStore } from '@/store/user-store'

interface NavChild {
  key: string
  href: string
  icon: typeof FolderGit2
}

interface NavGroupDirect {
  key: string
  href: string
  icon: typeof FolderGit2
  authRequired?: boolean
}

interface NavGroupDropdown {
  key: string
  icon: typeof FolderGit2
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

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const pathname = usePathname()
  const t = useTranslations()
  const { user } = useUserStore()

  const toggleGroup = (key: string) => {
    setExpandedGroup(expandedGroup === key ? null : key)
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-background border-t shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Handle bar */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              <div className="flex items-center justify-between px-6 pb-4">
                <span className="text-lg font-semibold">{t('nav.home')}</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="px-4 pb-8 space-y-1">
                {navGroups.map((group) => {
                  if ('authRequired' in group && group.authRequired && !user) return null

                  if ('href' in group && group.href) {
                    const isActive = pathname === group.href || pathname.startsWith(group.href)
                    const Icon = group.icon
                    return (
                      <Link
                        key={group.key}
                        href={group.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-accent'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {t(`nav.${group.key}`)}
                      </Link>
                    )
                  }

                  // Dropdown group
                  const isExpanded = expandedGroup === group.key
                  const Icon = group.icon
                  const hasActiveChild = 'children' in group && group.children?.some(
                    (child) => pathname === child.href || pathname.startsWith(child.href)
                  )

                  return (
                    <div key={group.key}>
                      <button
                        onClick={() => toggleGroup(group.key)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          hasActiveChild
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          {t(`nav.${group.key}`)}
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && 'children' in group && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-6 space-y-1 py-1">
                              {group.children?.map((child) => {
                                const ChildIcon = child.icon
                                const isActive = pathname === child.href || pathname.startsWith(child.href)
                                return (
                                  <Link
                                    key={child.key}
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                                      isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                                  >
                                    <ChildIcon className="h-4 w-4" />
                                    {t(`nav.${child.key}`)}
                                  </Link>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
