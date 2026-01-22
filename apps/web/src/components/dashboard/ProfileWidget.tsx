'use client'

import { User as UserIcon, Mail, GraduationCap, Award } from 'lucide-react'
import type { User } from '@/lib/api/types'
import { useTranslations } from '@/i18n/LanguageContext'

interface ProfileWidgetProps {
  user: User
}

export function ProfileWidget({ user }: ProfileWidgetProps) {
  const t = useTranslations()

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return t('dashboard.role.admin')
      case 'mentor':
        return t('dashboard.role.mentor')
      default:
        return t('dashboard.role.student')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <div className="relative">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-blue-500">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
          )}
          {/* Level Badge */}
          <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
            {user.level}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {user.name}
          </h2>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{user.email}</span>
            </div>
            {user.studentId && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  {user.studentId} {user.department && `· ${user.department}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Award className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                {user.experiencePoints.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
              user.role === 'admin'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : user.role === 'mentor'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            {getRoleLabel(user.role)}
          </span>
        </div>
      </div>
    </div>
  )
}
