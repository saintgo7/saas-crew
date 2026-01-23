'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Toast Types
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Default durations by type (ms)
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
}

/**
 * Toast Provider Component
 *
 * Wraps your app to provide toast notification functionality.
 *
 * Usage in components:
 * const { success, error } = useToast()
 * success('Saved!', 'Your changes have been saved.')
 * error('Failed', 'Could not save changes.')
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const duration = toast.duration ?? DEFAULT_DURATIONS[toast.type]

      setToasts((prev) => [...prev, { ...toast, id }])

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const success = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'success', title, message })
    },
    [addToast]
  )

  const error = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'error', title, message })
    },
    [addToast]
  )

  const warning = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'warning', title, message })
    },
    [addToast]
  )

  const info = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'info', title, message })
    },
    [addToast]
  )

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

/**
 * Hook to access toast functions
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * Toast Container - renders all active toasts
 */
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[]
  removeToast: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

/**
 * Individual Toast Item
 */
function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast
  onClose: () => void
}) {
  const { type, title, message } = toast

  const styles = getToastStyles(type)
  const Icon = getToastIcon(type)

  return (
    <div
      role="alert"
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg animate-in slide-in-from-right-full duration-300',
        styles.container
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('flex-shrink-0', styles.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className={cn('text-sm font-medium', styles.title)}>{title}</p>
            {message && (
              <p className={cn('mt-1 text-sm', styles.message)}>{message}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className={cn(
              'flex-shrink-0 rounded-lg p-1 transition-colors',
              styles.closeButton
            )}
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function getToastIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return CheckCircle2
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
  }
}

function getToastStyles(type: ToastType) {
  switch (type) {
    case 'success':
      return {
        container: 'bg-green-50 dark:bg-green-900/90 border border-green-200 dark:border-green-800',
        icon: 'text-green-500 dark:text-green-400',
        title: 'text-green-900 dark:text-green-100',
        message: 'text-green-700 dark:text-green-300',
        closeButton: 'text-green-500 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-800',
      }
    case 'error':
      return {
        container: 'bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-800',
        icon: 'text-red-500 dark:text-red-400',
        title: 'text-red-900 dark:text-red-100',
        message: 'text-red-700 dark:text-red-300',
        closeButton: 'text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800',
      }
    case 'warning':
      return {
        container: 'bg-yellow-50 dark:bg-yellow-900/90 border border-yellow-200 dark:border-yellow-800',
        icon: 'text-yellow-500 dark:text-yellow-400',
        title: 'text-yellow-900 dark:text-yellow-100',
        message: 'text-yellow-700 dark:text-yellow-300',
        closeButton: 'text-yellow-500 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-800',
      }
    case 'info':
      return {
        container: 'bg-blue-50 dark:bg-blue-900/90 border border-blue-200 dark:border-blue-800',
        icon: 'text-blue-500 dark:text-blue-400',
        title: 'text-blue-900 dark:text-blue-100',
        message: 'text-blue-700 dark:text-blue-300',
        closeButton: 'text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800',
      }
  }
}
