'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`h-4 w-4 shrink-0 rounded-sm border border-neutral-200 ring-offset-white peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-950 peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:bg-neutral-900 peer-checked:text-neutral-50 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:peer-focus-visible:ring-neutral-300 dark:peer-checked:bg-neutral-50 dark:peer-checked:text-neutral-900 ${className}`}
        >
          {checked && (
            <Check className="h-4 w-4 text-white dark:text-neutral-900" />
          )}
        </div>
      </div>
    )
  },
)
Checkbox.displayName = 'Checkbox'
