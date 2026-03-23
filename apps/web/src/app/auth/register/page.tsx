'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, User, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { useUserStore } from '@/store/user-store'
import { authApi } from '@/lib/api/auth'

interface FormErrors {
  email?: string
  name?: string
  password?: string
  confirmPassword?: string
}

const WKU_EMAIL_DOMAIN = '@wku.ac.kr'

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  const { setUser } = useUserStore()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')

  function validateForm(): boolean {
    const newErrors: FormErrors = {}

    if (!email.trim()) {
      newErrors.email = t('auth.register.error.emailRequired')
    } else if (!email.includes('@')) {
      newErrors.email = t('auth.register.error.emailInvalid')
    } else if (!email.toLowerCase().endsWith(WKU_EMAIL_DOMAIN)) {
      newErrors.email = t('auth.register.error.emailInvalidDomain')
    }

    if (!name.trim()) {
      newErrors.name = t('auth.register.error.nameRequired')
    } else if (name.trim().length < 2) {
      newErrors.name = t('auth.register.error.nameMinLength')
    }

    if (!password) {
      newErrors.password = t('auth.register.error.passwordRequired')
    } else if (password.length < 6) {
      newErrors.password = t('auth.register.error.passwordMinLength')
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('auth.register.error.confirmPasswordRequired')
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.register.error.passwordMismatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await authApi.register({
        email: email.toLowerCase().trim(),
        password,
        name: name.trim(),
      })

      localStorage.setItem('auth_token', response.accessToken)
      setUser(response.user)
      router.push('/courses')
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string }
      if (error.status === 409) {
        setServerError(t('auth.register.error.emailDuplicate'))
      } else if (error.message) {
        setServerError(error.message)
      } else {
        setServerError(t('auth.register.error.generic'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <span className="text-3xl font-bold text-white">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('auth.register.title')}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('auth.register.subtitle')}
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-800 dark:text-red-200">{serverError}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.register.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  placeholder={t('auth.register.emailPlaceholder')}
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500 dark:border-red-600'
                      : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                {t('auth.register.emailHelper')}
              </p>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.register.name')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors({ ...errors, name: undefined })
                  }}
                  placeholder={t('auth.register.namePlaceholder')}
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-500 dark:border-red-600'
                      : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                {t('auth.register.nameHelper')}
              </p>
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.register.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500 dark:border-red-600'
                      : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
                  }`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('auth.register.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: undefined })
                  }}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500 dark:border-red-600'
                      : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
                  }`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t('auth.register.submitting')}</span>
                </>
              ) : (
                <span>{t('auth.register.submit')}</span>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <span>{t('auth.register.hasAccount')} </span>
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.register.login')}
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-6 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
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
