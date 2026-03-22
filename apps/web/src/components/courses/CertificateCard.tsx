'use client'

import {
  Award,
  Calendar,
  Shield,
  Download,
  Share2,
  ExternalLink,
} from 'lucide-react'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { Certificate } from '@/lib/api/certificates'

interface CertificateCardProps {
  certificate: Certificate
  className?: string
  showActions?: boolean
}

const levelGradients: Record<string, string> = {
  JUNIOR: 'from-green-500 to-emerald-600',
  SENIOR: 'from-blue-500 to-indigo-600',
  MASTER: 'from-purple-500 to-violet-600',
}

const levelBorders: Record<string, string> = {
  JUNIOR: 'border-green-300 dark:border-green-700',
  SENIOR: 'border-blue-300 dark:border-blue-700',
  MASTER: 'border-purple-300 dark:border-purple-700',
}

export function CertificateCard({
  certificate,
  className,
  showActions = true,
}: CertificateCardProps) {
  const t = useTranslations()
  const { locale } = useLanguage()

  const level = certificate.courseLevel || 'JUNIOR'
  const gradient = levelGradients[level] || levelGradients.JUNIOR
  const border = levelBorders[level] || levelBorders.JUNIOR

  const handleShare = async () => {
    const url = `${window.location.origin}/certificates/verify/${certificate.certificateNumber}`
    try {
      await navigator.clipboard.writeText(url)
      alert(t('certificate.linkCopied'))
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      alert(t('certificate.linkCopied'))
    }
  }

  const handleDownload = () => {
    alert(t('certificate.downloadComingSoon'))
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border-2 bg-white dark:bg-gray-800',
        border,
        className,
      )}
    >
      {/* Certificate header gradient */}
      <div
        className={cn(
          'relative bg-gradient-to-r px-6 py-8 text-center text-white',
          gradient,
        )}
      >
        {/* Decorative corner elements */}
        <div className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-white/30" />
        <div className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-white/30" />
        <div className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-white/30" />
        <div className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-white/30" />

        <Award className="mx-auto mb-3 h-10 w-10 text-white/90" />
        <h3 className="text-xl font-bold">{t('certificate.ofCompletion')}</h3>
        <p className="mt-1 text-sm text-white/80">CrewSpace</p>
      </div>

      {/* Certificate body */}
      <div className="px-6 py-6 text-center">
        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
          {t('certificate.certifies')}
        </p>
        <h4 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          {certificate.user?.name || 'Student'}
        </h4>

        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
          {t('certificate.hasCompleted')}
        </p>
        <h5 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          {certificate.courseName || certificate.course?.title}
        </h5>

        {/* Certificate details */}
        <div className="mb-4 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(certificate.issuedAt).toLocaleDateString(
                locale === 'ko' ? 'ko-KR' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' },
              )}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-400">
              {t('certificate.verified')}
            </span>
          </div>
        </div>

        {/* Certificate number */}
        <div className="mx-auto max-w-xs rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-700/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('certificate.certificateNumber')}
          </p>
          <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
            {certificate.certificateNumber}
          </p>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Share2 className="h-4 w-4" />
            {t('certificate.share')}
          </button>
          <div className="w-px bg-gray-200 dark:bg-gray-700" />
          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
            {t('certificate.download')}
          </button>
          <div className="w-px bg-gray-200 dark:bg-gray-700" />
          <Link
            href={`/certificates/verify/${certificate.certificateNumber}`}
            className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ExternalLink className="h-4 w-4" />
            {t('certificate.verify')}
          </Link>
        </div>
      )}
    </div>
  )
}
