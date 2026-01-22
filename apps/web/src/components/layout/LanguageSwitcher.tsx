'use client'

import { useLanguage } from '@/i18n/LanguageContext'
import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { locales, getLocaleLabel } from '@/i18n/config'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc)
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                locale === loc
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="font-medium">{loc.toUpperCase()}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {getLocaleLabel(loc)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
