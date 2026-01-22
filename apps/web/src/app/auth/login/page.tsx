'use client'

import { Github } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function LoginPage() {
  const t = useTranslations()

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/github`
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <span className="text-3xl font-bold text-white">W</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              WKU Software Crew
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('auth.login.subtitle')}
            </p>
          </div>

          {/* Login Info */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{t('auth.login.notice').split(':')[0]}:</strong> {t('auth.login.noticeDesc')}
            </p>
          </div>

          {/* GitHub Login Button */}
          <button
            onClick={handleGithubLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-gray-800 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-700 dark:border-gray-600"
          >
            <Github className="h-5 w-5" />
            <span>{t('auth.login.withGithub')}</span>
          </button>

          {/* Info */}
          <div className="mt-6 space-y-2 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>{t('auth.login.features.title')}</p>
            <ul className="space-y-1 text-left">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {t('auth.login.features.projects')}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {t('auth.login.features.courses')}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {t('auth.login.features.community')}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {t('auth.login.features.levelUp')}
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <p>
              {t('auth.login.info')}
              <br />
              {t('common.contactAdmin')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
