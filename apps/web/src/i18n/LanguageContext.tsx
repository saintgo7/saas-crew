'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Locale } from './config'
import { defaultLocale } from './config'

// Import messages
import koMessages from '../../messages/ko.json'
import enMessages from '../../messages/en.json'

type Messages = typeof koMessages

const messagesMap: Record<Locale, Messages> = {
  ko: koMessages,
  en: enMessages,
}

interface LanguageContextType {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LOCALE_STORAGE_KEY = 'wku-crew-locale'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (savedLocale && (savedLocale === 'ko' || savedLocale === 'en')) {
      setLocaleState(savedLocale)
    }
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    // Update document lang attribute
    document.documentElement.lang = newLocale
  }, [])

  // Translation function with nested key support
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const messages = messagesMap[locale]
      const keys = key.split('.')
      let value: any = messages

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          console.warn(`Translation key not found: ${key}`)
          return key
        }
      }

      if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${key}`)
        return key
      }

      // Replace parameters
      if (params) {
        return Object.entries(params).reduce(
          (str, [paramKey, paramValue]) =>
            str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
          value
        )
      }

      return value
    },
    [locale]
  )

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{
          locale: defaultLocale,
          messages: messagesMap[defaultLocale],
          setLocale: () => {},
          t: (key) => key,
        }}
      >
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        messages: messagesMap[locale],
        setLocale,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Shorthand hook for translations
export function useTranslations() {
  const { t } = useLanguage()
  return t
}
