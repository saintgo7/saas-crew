'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string | ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

/**
 * Confirmation Dialog Component
 *
 * Use for destructive or important actions that require user confirmation.
 *
 * Usage:
 * const [isOpen, setIsOpen] = useState(false)
 *
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Item"
 *   message="Are you sure you want to delete this item?"
 *   variant="danger"
 * />
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = useCallback(async () => {
    try {
      setIsConfirming(true)
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Confirm action failed:', error)
    } finally {
      setIsConfirming(false)
    }
  }, [onConfirm, onClose])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !isConfirming) {
        onClose()
      }
    },
    [onClose, isConfirming]
  )

  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      confirmButton:
        'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white',
    },
    warning: {
      icon: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      confirmButton:
        'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white',
    },
    info: {
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      confirmButton:
        'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white',
    },
  }

  const styles = variantStyles[variant]
  const loading = isLoading || isConfirming

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div
          className={cn(
            'mx-auto flex h-12 w-12 items-center justify-center rounded-full',
            styles.iconBg
          )}
        >
          <AlertTriangle className={cn('h-6 w-6', styles.icon)} />
        </div>

        {/* Title */}
        <h3
          id="dialog-title"
          className="mt-4 text-center text-lg font-semibold text-gray-900 dark:text-white"
        >
          {title}
        </h3>

        {/* Message */}
        <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {message}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              'flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              styles.confirmButton
            )}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook for managing confirm dialog state
 */
export function useConfirmDialog() {
  const [state, setState] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void | Promise<void>
    variant?: 'danger' | 'warning' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning',
  })

  const confirm = useCallback(
    (options: {
      title: string
      message: string
      onConfirm: () => void | Promise<void>
      variant?: 'danger' | 'warning' | 'info'
    }) => {
      setState({
        isOpen: true,
        ...options,
      })
    },
    []
  )

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return {
    dialogProps: {
      isOpen: state.isOpen,
      onClose: close,
      onConfirm: state.onConfirm,
      title: state.title,
      message: state.message,
      variant: state.variant,
    },
    confirm,
    close,
  }
}
