'use client'

import { motion } from 'framer-motion'
import { useTranslations } from '@/i18n/LanguageContext'

interface Tab {
  key: string
  label: string
}

interface ProjectTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Tab[]
}

export function ProjectTabs({ activeTab, onTabChange, tabs }: ProjectTabsProps) {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
      <nav className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="project-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
