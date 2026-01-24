'use client'

import {
  createContext,
  useContext,
  HTMLAttributes,
  InputHTMLAttributes,
  forwardRef,
} from 'react'

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroupContext = createContext<RadioGroupContextValue>({})

interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className = '', value, onValueChange, name, children, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange, name }}>
        <div
          ref={ref}
          role="radiogroup"
          className={`grid gap-2 ${className}`}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  },
)
RadioGroup.displayName = 'RadioGroup'

interface RadioGroupItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string
}

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className = '', value, ...props }, ref) => {
    const context = useContext(RadioGroupContext)
    const isChecked = context.value === value

    return (
      <div className="relative inline-flex items-center">
        <input
          type="radio"
          ref={ref}
          value={value}
          name={context.name}
          checked={isChecked}
          onChange={() => context.onValueChange?.(value)}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`aspect-square h-4 w-4 rounded-full border border-neutral-200 text-neutral-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:border-neutral-800 dark:text-neutral-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 ${className}`}
        >
          {isChecked && (
            <span className="flex items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-current" />
            </span>
          )}
        </div>
      </div>
    )
  },
)
RadioGroupItem.displayName = 'RadioGroupItem'
