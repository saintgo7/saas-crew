import { HTMLAttributes, forwardRef } from 'react'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'outline'
  | 'destructive'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  secondary:
    'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  warning:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  outline:
    'border border-neutral-200 text-neutral-800 dark:border-neutral-700 dark:text-neutral-300',
  destructive: 'bg-red-500 text-white dark:bg-red-900 dark:text-red-50',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
        {...props}
      />
    )
  },
)
Badge.displayName = 'Badge'
