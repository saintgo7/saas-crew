'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Save,
  Loader2,
  RefreshCw,
  Settings,
  Users,
  Lock,
  Bell,
  Globe,
  Database,
  Palette,
  BookOpen,
  FolderKanban,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface SiteSettings {
  // General Settings
  siteName: string
  siteDescription: string
  logoUrl: string
  faviconUrl: string

  // User Settings
  allowRegistration: boolean
  requireEmailVerification: boolean
  defaultUserRole: string
  maxProjectsPerUser: number

  // Authentication Settings
  enableGitHubAuth: boolean
  enableGoogleAuth: boolean
  enableEmailAuth: boolean
  sessionTimeout: number

  // Feature Toggles
  enableCourses: boolean
  enableProjects: boolean
  enableCommunity: boolean
  enableLeaderboard: boolean
  enableNotifications: boolean

  // Content Settings
  requireProjectApproval: boolean
  requirePostApproval: boolean
  maxFileUploadSize: number

  // Appearance
  defaultTheme: 'light' | 'dark' | 'system'
  primaryColor: string
}

const defaultSettings: SiteSettings = {
  siteName: 'WKU Software Crew',
  siteDescription: 'WKU Software Crew education platform',
  logoUrl: '',
  faviconUrl: '',

  allowRegistration: true,
  requireEmailVerification: false,
  defaultUserRole: 'student',
  maxProjectsPerUser: 5,

  enableGitHubAuth: true,
  enableGoogleAuth: false,
  enableEmailAuth: true,
  sessionTimeout: 7,

  enableCourses: true,
  enableProjects: true,
  enableCommunity: true,
  enableLeaderboard: true,
  enableNotifications: true,

  requireProjectApproval: false,
  requirePostApproval: false,
  maxFileUploadSize: 10,

  defaultTheme: 'system',
  primaryColor: '#3b82f6',
}

type SettingsSection = 'general' | 'users' | 'auth' | 'features' | 'content' | 'appearance'

export default function AdminSettingsPage() {
  const queryClient = useQueryClient()
  const [activeSection, setActiveSection] = useState<SettingsSection>('general')
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        // Return default settings if endpoint doesn't exist
        return defaultSettings
      }
      return res.json() as Promise<SiteSettings>
    },
  })

  useEffect(() => {
    if (data) {
      setSettings({ ...defaultSettings, ...data })
    }
  }, [data])

  const saveMutation = useMutation({
    mutationFn: async (newSettings: SiteSettings) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSettings),
      })
      if (!res.ok) throw new Error('Failed to save settings')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      setHasChanges(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
  })

  const updateSetting = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    saveMutation.mutate(settings)
  }

  const handleReset = () => {
    if (data) {
      setSettings({ ...defaultSettings, ...data })
      setHasChanges(false)
    }
  }

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'auth', label: 'Authentication', icon: Lock },
    { id: 'features', label: 'Features', icon: Globe },
    { id: 'content', label: 'Content', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ] as const

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage system configuration
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              Saved successfully
            </span>
          )}
          {hasChanges && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saveMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <AlertCircle className="h-5 w-5" />
          <p>Settings could not be loaded from server. Using default values.</p>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64">
          <nav className="space-y-1 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                <section.icon className="h-4 w-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                General Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={settings.logoUrl}
                    onChange={(e) => updateSetting('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    value={settings.faviconUrl}
                    onChange={(e) => updateSetting('faviconUrl', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* User Settings */}
          {activeSection === 'users' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                User Settings
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Allow Registration</p>
                    <p className="text-sm text-gray-500">Allow new users to register</p>
                  </div>
                  <button
                    onClick={() => updateSetting('allowRegistration', !settings.allowRegistration)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.allowRegistration ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.allowRegistration && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Require Email Verification</p>
                    <p className="text-sm text-gray-500">Users must verify their email before accessing</p>
                  </div>
                  <button
                    onClick={() => updateSetting('requireEmailVerification', !settings.requireEmailVerification)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.requireEmailVerification ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.requireEmailVerification && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Default User Role
                  </label>
                  <select
                    value={settings.defaultUserRole}
                    onChange={(e) => updateSetting('defaultUserRole', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Projects Per User
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={settings.maxProjectsPerUser}
                    onChange={(e) => updateSetting('maxProjectsPerUser', parseInt(e.target.value) || 1)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Authentication Settings */}
          {activeSection === 'auth' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Authentication Settings
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Authentication</p>
                    <p className="text-sm text-gray-500">Allow login with email and password</p>
                  </div>
                  <button
                    onClick={() => updateSetting('enableEmailAuth', !settings.enableEmailAuth)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.enableEmailAuth ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.enableEmailAuth && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">GitHub Authentication</p>
                    <p className="text-sm text-gray-500">Allow login with GitHub account</p>
                  </div>
                  <button
                    onClick={() => updateSetting('enableGitHubAuth', !settings.enableGitHubAuth)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.enableGitHubAuth ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.enableGitHubAuth && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Google Authentication</p>
                    <p className="text-sm text-gray-500">Allow login with Google account</p>
                  </div>
                  <button
                    onClick={() => updateSetting('enableGoogleAuth', !settings.enableGoogleAuth)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.enableGoogleAuth ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.enableGoogleAuth && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Session Timeout (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 7)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-sm text-gray-500">Number of days before users must log in again</p>
                </div>
              </div>
            </div>
          )}

          {/* Feature Toggles */}
          {activeSection === 'features' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Feature Toggles
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Courses</p>
                      <p className="text-sm text-gray-500">Enable course management and learning</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('enableCourses', !settings.enableCourses)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.enableCourses ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.enableCourses && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <FolderKanban className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Projects</p>
                      <p className="text-sm text-gray-500">Enable project showcase and collaboration</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('enableProjects', !settings.enableProjects)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.enableProjects ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.enableProjects && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Community</p>
                      <p className="text-sm text-gray-500">Enable Q&A and community discussions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('enableCommunity', !settings.enableCommunity)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.enableCommunity ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.enableCommunity && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Leaderboard</p>
                      <p className="text-sm text-gray-500">Show user rankings and achievements</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('enableLeaderboard', !settings.enableLeaderboard)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.enableLeaderboard ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.enableLeaderboard && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                      <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                      <p className="text-sm text-gray-500">Enable email and push notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('enableNotifications', !settings.enableNotifications)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.enableNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.enableNotifications && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content Settings */}
          {activeSection === 'content' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Content Settings
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Require Project Approval</p>
                    <p className="text-sm text-gray-500">Projects must be approved before they are public</p>
                  </div>
                  <button
                    onClick={() => updateSetting('requireProjectApproval', !settings.requireProjectApproval)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.requireProjectApproval ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.requireProjectApproval && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Require Post Approval</p>
                    <p className="text-sm text-gray-500">Community posts must be approved before publishing</p>
                  </div>
                  <button
                    onClick={() => updateSetting('requirePostApproval', !settings.requirePostApproval)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.requirePostApproval ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        settings.requirePostApproval && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max File Upload Size (MB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.maxFileUploadSize}
                    onChange={(e) => updateSetting('maxFileUploadSize', parseInt(e.target.value) || 10)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-sm text-gray-500">Maximum file size users can upload</p>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Appearance Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Default Theme
                  </label>
                  <select
                    value={settings.defaultTheme}
                    onChange={(e) => updateSetting('defaultTheme', e.target.value as 'light' | 'dark' | 'system')}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Default theme for new users</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Primary Color
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="h-10 w-20 cursor-pointer rounded-lg border border-gray-300"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="#3b82f6"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Primary brand color for the site</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
