'use client'

import { useMemo } from 'react'
import {
  Award,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
} from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import {
  useGenerateCertificate,
  useCourseCompletion,
  useMyCertificates,
} from '@/lib/hooks/use-certificates'
import { CertificateCard } from './CertificateCard'
import { cn } from '@/lib/utils'

interface CertificateSectionProps {
  courseId: string
  courseName: string
  overallProgress: number
  isDemo?: boolean
}

export function CertificateSection({
  courseId,
  courseName,
  overallProgress,
  isDemo = false,
}: CertificateSectionProps) {
  const t = useTranslations()
  const generateCertificate = useGenerateCertificate()

  const { data: completion, isLoading: completionLoading } =
    useCourseCompletion(courseId, !isDemo)
  const { data: myCertificates } = useMyCertificates()

  const existingCertificate = useMemo(() => {
    if (!myCertificates) return null
    return myCertificates.find((c) => c.courseId === courseId) ?? null
  }, [myCertificates, courseId])

  const handleGenerate = async () => {
    if (isDemo) {
      alert(t('courses.demoBanner'))
      return
    }

    try {
      await generateCertificate.mutateAsync(courseId)
    } catch (err) {
      // Error handled by mutation state
    }
  }

  // If certificate already exists, show it
  if (existingCertificate) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="font-medium text-green-800 dark:text-green-300">
              {t('certificate.alreadyIssued')}
            </p>
          </div>
        </div>
        <CertificateCard certificate={existingCertificate} />
      </div>
    )
  }

  const isComplete = isDemo ? overallProgress === 100 : completion?.isComplete
  const chaptersInfo = isDemo
    ? { completed: overallProgress === 100 ? 5 : 3, total: 5 }
    : {
        completed: completion?.completedChapters ?? 0,
        total: completion?.totalChapters ?? 0,
      }
  const quizzesInfo = isDemo
    ? { passed: overallProgress === 100 ? 2 : 1, total: 2 }
    : {
        passed: completion?.passedQuizzes ?? 0,
        total: completion?.requiredQuizzes ?? 0,
      }

  return (
    <div className="space-y-6">
      {/* Demo banner */}
      {isDemo && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Info className="h-4 w-4" />
            {t('courses.demoBanner')}
          </p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
            <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('certificate.getCertificate')}
          </h3>
        </div>

        {/* Progress checklist */}
        <div className="mb-6 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('certificate.progress')}
          </p>

          {/* Chapters progress */}
          <div className="flex items-center gap-3">
            {chaptersInfo.completed >= chaptersInfo.total ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
            <span
              className={cn(
                'text-sm',
                chaptersInfo.completed >= chaptersInfo.total
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400',
              )}
            >
              {t('certificate.chaptersCompleted', {
                completed: chaptersInfo.completed.toString(),
                total: chaptersInfo.total.toString(),
              })}
            </span>
          </div>

          {/* Quizzes progress */}
          {quizzesInfo.total > 0 && (
            <div className="flex items-center gap-3">
              {quizzesInfo.passed >= quizzesInfo.total ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-400" />
              )}
              <span
                className={cn(
                  'text-sm',
                  quizzesInfo.passed >= quizzesInfo.total
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400',
                )}
              >
                {t('certificate.quizzesPassed', {
                  passed: quizzesInfo.passed.toString(),
                  total: quizzesInfo.total.toString(),
                })}
              </span>
            </div>
          )}
        </div>

        {/* Generate button */}
        {isComplete ? (
          <button
            onClick={handleGenerate}
            disabled={generateCertificate.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generateCertificate.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('certificate.getting')}
              </>
            ) : (
              <>
                <Award className="h-4 w-4" />
                {t('certificate.getCertificate')}
              </>
            )}
          </button>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('certificate.cannotGetCertificate')}.{' '}
              {t('certificate.completeAllChapters')}
              {quizzesInfo.total > 0 &&
                ` ${t('certificate.passAllQuizzes')}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
