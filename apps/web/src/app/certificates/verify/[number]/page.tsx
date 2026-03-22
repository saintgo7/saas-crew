'use client'

import { useState, use } from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldX,
  Loader2,
  Search,
  Calendar,
  Award,
  User,
  BookOpen,
} from 'lucide-react'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'
import { useVerifyCertificate } from '@/lib/hooks/use-certificates'
import { cn } from '@/lib/utils'

interface VerifyPageProps {
  params: Promise<{
    number: string
  }>
}

export default function CertificateVerifyPage({ params }: VerifyPageProps) {
  const { number } = use(params)
  const t = useTranslations()
  const { locale } = useLanguage()
  const [searchInput, setSearchInput] = useState(
    number === 'check' ? '' : number,
  )
  const [certNumber, setCertNumber] = useState(
    number === 'check' ? '' : decodeURIComponent(number),
  )

  const { data: verification, isLoading, error } = useVerifyCertificate(
    certNumber,
    !!certNumber && certNumber !== 'check',
  )

  const handleSearch = () => {
    if (searchInput.trim()) {
      setCertNumber(searchInput.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8 text-center">
        <Shield className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('certificate.verify')}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {t('certificate.verifyDescription')}
        </p>
      </div>

      {/* Search input */}
      <div className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('certificate.verifyPlaceholder')}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchInput.trim() || isLoading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t('certificate.verify')
            )}
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('certificate.verifying')}
            </p>
          </div>
        </div>
      )}

      {/* Valid certificate */}
      {verification?.valid && verification.certificate && (
        <div className="overflow-hidden rounded-xl border-2 border-green-300 bg-white dark:border-green-700 dark:bg-gray-800">
          {/* Valid header */}
          <div className="bg-green-50 px-6 py-4 dark:bg-green-900/20">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-bold text-green-800 dark:text-green-300">
                {t('certificate.valid')}
              </h2>
            </div>
          </div>

          {/* Certificate details */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="flex items-center gap-4 px-6 py-4">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('certificate.holder')}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {verification.certificate.userName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('certificate.course')}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {verification.certificate.courseName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Award className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('certificate.level')}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {verification.certificate.courseLevel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('certificate.issuedAt')}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(
                    verification.certificate.issuedAt,
                  ).toLocaleDateString(
                    locale === 'ko' ? 'ko-KR' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' },
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('certificate.certificateNumber')}
                </p>
                <p className="font-mono font-semibold text-gray-900 dark:text-white">
                  {verification.certificate.certificateNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invalid certificate */}
      {verification && !verification.valid && (
        <div className="rounded-xl border-2 border-red-300 bg-white p-8 text-center dark:border-red-700 dark:bg-gray-800">
          <ShieldX className="mx-auto mb-4 h-12 w-12 text-red-500 dark:text-red-400" />
          <h2 className="mb-2 text-lg font-bold text-red-800 dark:text-red-300">
            {t('certificate.invalid')}
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400">
            {verification.message || t('certificate.notFound')}
          </p>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && certNumber && (
        <div className="rounded-xl border-2 border-red-300 bg-white p-8 text-center dark:border-red-700 dark:bg-gray-800">
          <ShieldX className="mx-auto mb-4 h-12 w-12 text-red-500 dark:text-red-400" />
          <h2 className="mb-2 text-lg font-bold text-red-800 dark:text-red-300">
            {t('certificate.notFound')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('certificate.verifyDescription')}
          </p>
        </div>
      )}
    </div>
  )
}
