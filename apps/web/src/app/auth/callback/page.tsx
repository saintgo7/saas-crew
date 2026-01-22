'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUserStore } from '@/store/user-store'
import { useTranslations } from '@/i18n/LanguageContext'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

function AuthCallbackContent() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useUserStore()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setErrorMessage(error)
        return
      }

      if (!token) {
        setStatus('error')
        setErrorMessage('No token received')
        return
      }

      try {
        // Store token in localStorage
        localStorage.setItem('auth_token', token)

        // Fetch user profile
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const user = await response.json()
        setUser(user)
        setStatus('success')

        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } catch (err) {
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Authentication failed')
        localStorage.removeItem('auth_token')
      }
    }

    handleCallback()
  }, [searchParams, setUser, router])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {t('auth.callback.loading')}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {t('auth.callback.pleaseWait')}
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {t('auth.callback.success')}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {t('auth.callback.redirecting')}
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="mx-auto h-12 w-12 text-red-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {t('auth.callback.error')}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {errorMessage}
                </p>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {t('auth.callback.tryAgain')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Loading...
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  )
}
