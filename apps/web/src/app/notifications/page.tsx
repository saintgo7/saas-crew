'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NotificationList } from '@/components/notifications'
import { useUserStore } from '@/store/user-store'
import { useTranslations } from '@/i18n/LanguageContext'

export default function NotificationsPage() {
  const router = useRouter()
  const t = useTranslations()
  const { user } = useUserStore()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  // Show loading or nothing while checking auth
  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <NotificationList />
    </div>
  )
}
