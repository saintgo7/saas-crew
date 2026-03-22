'use client'

import { useState } from 'react'
import {
  Award,
  Loader2,
  Search,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from '@/i18n/LanguageContext'
import { useMyCertificates } from '@/lib/hooks/use-certificates'
import { CertificateCard } from '@/components/courses/CertificateCard'
import type { Certificate } from '@/lib/api/certificates'

const DEMO_CERTIFICATES: Certificate[] = [
  {
    id: 'demo-cert-1',
    certificateNumber: 'CERT-2026-DEMO0001',
    userId: 'demo-user',
    courseId: 'demo-course-1',
    courseName: 'React Fundamentals',
    courseLevel: 'JUNIOR',
    issuedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    user: {
      id: 'demo-user',
      name: 'Demo Student',
      email: 'demo@example.com',
    },
  },
  {
    id: 'demo-cert-2',
    certificateNumber: 'CERT-2026-DEMO0002',
    userId: 'demo-user',
    courseId: 'demo-course-2',
    courseName: 'Advanced TypeScript',
    courseLevel: 'SENIOR',
    issuedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    user: {
      id: 'demo-user',
      name: 'Demo Student',
      email: 'demo@example.com',
    },
  },
]

export default function CertificatesPage() {
  const t = useTranslations()
  const { data: certificates, isLoading, error } = useMyCertificates()
  const [searchQuery, setSearchQuery] = useState('')

  const isDemo = !!error || (!isLoading && !certificates)
  const displayCertificates = isDemo ? DEMO_CERTIFICATES : (certificates || [])

  const filteredCertificates = displayCertificates.filter((cert) =>
    cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('certificate.myCertificates')}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t('certificate.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Demo banner */}
      {isDemo && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Info className="h-4 w-4" />
            {t('courses.demoBanner')}
          </p>
        </div>
      )}

      {/* Search and verify link */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('certificate.verifyPlaceholder')}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <Link
          href="/certificates/verify/check"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Search className="h-4 w-4" />
          {t('certificate.verify')}
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredCertificates.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <Award className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            {t('certificate.subtitle')}
          </p>
          <Link
            href="/courses"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {t('nav.courses')}
          </Link>
        </div>
      )}

      {/* Certificate grid */}
      {filteredCertificates.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredCertificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  )
}
