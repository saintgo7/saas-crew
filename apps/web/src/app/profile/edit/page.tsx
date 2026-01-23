'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useUserStore } from '@/store/user-store'
import { useTranslations } from '@/i18n/LanguageContext'
import { ProfileForm } from '@/components/profile/ProfileForm'
import type { UpdateUserInput } from '@/lib/api/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function ProfileEditPage() {
  const t = useTranslations()
  const router = useRouter()
  const { user, setUser } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token && !user) {
      router.push('/auth/login')
      return
    }

    // Fetch user data if not in store
    if (!user && token) {
      fetchUser(token)
    } else {
      setIsLoading(false)
    }
  }, [user, router])

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem('auth_token')
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data: UpdateUserInput) => {
    const token = localStorage.getItem('auth_token')
    if (!token || !user) {
      throw new Error(t('profile.notAuthenticated'))
    }

    const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || t('profile.saveError'))
    }

    const updatedUser = await response.json()
    setUser(updatedUser)
    setIsSaved(true)
  }

  const handleCancel = () => {
    router.push('/profile')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header with back button */}
      <div className="mb-8">
        <Link
          href="/profile"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('profile.backToProfile')}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('profile.editProfile')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('profile.editSubtitle')}
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <ProfileForm user={user} onSave={handleSave} onCancel={handleCancel} />
      </div>

      {/* Help Text */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-300">
          {t('profile.helpTitle')}
        </h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-400">
          <li>{t('profile.helpTip1')}</li>
          <li>{t('profile.helpTip2')}</li>
          <li>{t('profile.helpTip3')}</li>
        </ul>
      </div>
    </div>
  )
}
