'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User as UserIcon,
  Edit2,
  Award,
  Calendar,
  Github,
  Trophy,
  Twitter,
  Linkedin,
  Globe,
} from 'lucide-react'
import { useUserStore } from '@/store/user-store'
import { useTranslations, useLanguage } from '@/i18n/LanguageContext'
import { ProfileForm } from '@/components/profile/ProfileForm'
import type { UpdateUserInput } from '@/lib/api/types'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function ProfilePage() {
  const t = useTranslations()
  const { locale } = useLanguage()
  const dateLocale = locale === 'ko' ? ko : enUS
  const router = useRouter()
  const { user, setUser } = useUserStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data: UpdateUserInput) => {
    const token = localStorage.getItem('auth_token')
    if (!token || !user) return

    const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update profile')
    }

    const updatedUser = await response.json()
    setUser(updatedUser)
    setIsEditing(false)
  }

  const getRankLabel = (rank?: string) => {
    switch (rank) {
      case 'MASTER':
        return t('home.levelSystem.master.name')
      case 'SENIOR':
        return t('home.levelSystem.senior.name')
      default:
        return t('home.levelSystem.junior.name')
    }
  }

  const getRankColor = (rank?: string) => {
    switch (rank) {
      case 'MASTER':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'SENIOR':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('profile.title')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Profile Image */}
            <div className="relative mx-auto mb-4 h-32 w-32">
              {user.profileImage || user.avatar ? (
                <img
                  src={user.profileImage || user.avatar}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover ring-4 ring-blue-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-blue-500">
                  <UserIcon className="h-16 w-16 text-white" />
                </div>
              )}
              {/* Level Badge */}
              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-lg font-bold text-white shadow-lg">
                {user.level}
              </div>
            </div>

            {/* User Name */}
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h2>

            {/* Rank Badge */}
            <div className="mt-2 flex justify-center">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${getRankColor(user.rank)}`}>
                <Trophy className="h-4 w-4" />
                {getRankLabel(user.rank)}
              </span>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <Award className="h-4 w-4" />
                </div>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {user.experiencePoints?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-500">XP</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <Calendar className="h-4 w-4" />
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {user.createdAt && !isNaN(new Date(user.createdAt).getTime())
                    ? formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                        locale: dateLocale,
                      })
                    : '-'}
                </p>
                <p className="text-sm text-gray-500">{t('profile.joined')}</p>
              </div>
            </div>

            {/* Social Links */}
            {(user.githubId || user.socialLinks?.github || user.socialLinks?.twitter || user.socialLinks?.linkedin || user.socialLinks?.website) && (
              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {/* GitHub */}
                  {(user.githubId || user.socialLinks?.github) && (
                    <a
                      href={`https://github.com/${user.socialLinks?.github || user.githubId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      title="GitHub"
                    >
                      <Github className="h-5 w-5" />
                      <span className="text-sm">{user.socialLinks?.github || user.githubId}</span>
                    </a>
                  )}
                  {/* Twitter */}
                  {user.socialLinks?.twitter && (
                    <a
                      href={`https://twitter.com/${user.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      title="Twitter / X"
                    >
                      <Twitter className="h-5 w-5" />
                      <span className="text-sm">@{user.socialLinks.twitter}</span>
                    </a>
                  )}
                  {/* LinkedIn */}
                  {user.socialLinks?.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${user.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span className="text-sm">{user.socialLinks.linkedin}</span>
                    </a>
                  )}
                  {/* Website */}
                  {user.socialLinks?.website && (
                    <a
                      href={user.socialLinks.website.startsWith('http') ? user.socialLinks.website : `https://${user.socialLinks.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      title={t('profile.website')}
                    >
                      <Globe className="h-5 w-5" />
                      <span className="text-sm">{user.socialLinks.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Profile Details/Edit Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditing ? t('profile.editProfile') : t('profile.details')}
              </h3>
              {!isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    {t('common.edit')}
                  </button>
                  <Link
                    href="/profile/edit"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                  >
                    {t('profile.editProfile')}
                  </Link>
                </div>
              )}
            </div>

            {isEditing ? (
              <ProfileForm
                user={user}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('profile.email')}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('profile.department')}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.department || t('profile.notSet')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('profile.grade')}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.grade ? t('profile.gradeYear', { year: user.grade }) : t('profile.notSet')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('profile.bio')}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.bio || t('profile.notSet')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('profile.level')}
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-blue-600">Lv. {user.level}</span>
                      <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${(user.experiencePoints % 1000) / 10}%` }}
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {user.experiencePoints?.toLocaleString() || 0} XP / {((user.level || 1) * 1000).toLocaleString()} XP
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
