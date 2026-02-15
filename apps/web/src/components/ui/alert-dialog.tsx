'use client'

import {
  createContext,
  useContext,
  useState,
  HTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
} from 'react'

interface AlertDialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const AlertDialogContext = createContext<AlertDialogContextValue>({
  open: false,
  setOpen: () => {},
})

interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function AlertDialog({
  open: controlledOpen,
  onOpenChange,
  children,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

interface AlertDialogTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const AlertDialogTrigger = forwardRef<
  HTMLButtonElement,
  AlertDialogTriggerProps
>(({ onClick, children, ...props }, ref) => {
  const { setOpen } = useContext(AlertDialogContext)

  return (
    <button
      ref={ref}
      onClick={(e) => {
        setOpen(true)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
AlertDialogTrigger.displayName = 'AlertDialogTrigger'

interface AlertDialogContentProps extends HTMLAttributes<HTMLDivElement> {}

export const AlertDialogContent = forwardRef<
  HTMLDivElement,
  AlertDialogContentProps
>(({ className = '', children, ...props }, ref) => {
  const { open, setOpen } = useContext(AlertDialogContext)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/80"
        onClick={() => setOpen(false)}
      />
      <div
        ref={ref}
        className={`fixed z-50 grid w-full max-w-lg gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950 ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
AlertDialogContent.displayName = 'AlertDialogContent'

interface AlertDialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const AlertDialogHeader = forwardRef<
  HTMLDivElement,
  AlertDialogHeaderProps
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}
    {...props}
  />
))
AlertDialogHeader.displayName = 'AlertDialogHeader'

interface AlertDialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const AlertDialogFooter = forwardRef<
  HTMLDivElement,
  AlertDialogFooterProps
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
    {...props}
  />
))
AlertDialogFooter.displayName = 'AlertDialogFooter'

interface AlertDialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const AlertDialogTitle = forwardRef<
  HTMLHeadingElement,
  AlertDialogTitleProps
>(({ className = '', ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold ${className}`}
    {...props}
  />
))
AlertDialogTitle.displayName = 'AlertDialogTitle'

interface AlertDialogDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const AlertDialogDescription = forwardRef<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(({ className = '', ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-neutral-500 dark:text-neutral-400 ${className}`}
    {...props}
  />
))
AlertDialogDescription.displayName = 'AlertDialogDescription'

interface AlertDialogActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const AlertDialogAction = forwardRef<
  HTMLButtonElement,
  AlertDialogActionProps
>(({ className = '', onClick, ...props }, ref) => {
  const { setOpen } = useContext(AlertDialogContext)

  return (
    <button
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 ring-offset-white transition-colors hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:ring-offset-neutral-950 dark:hover:bg-neutral-50/90 dark:focus-visible:ring-neutral-300 ${className}`}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
      {...props}
    />
  )
})
AlertDialogAction.displayName = 'AlertDialogAction'

interface AlertDialogCancelProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const AlertDialogCancel = forwardRef<
  HTMLButtonElement,
  AlertDialogCancelProps
>(({ className = '', onClick, ...props }, ref) => {
  const { setOpen } = useContext(AlertDialogContext)

  return (
    <button
      ref={ref}
      className={`mt-2 inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium ring-offset-white transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus-visible:ring-neutral-300 ${className}`}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = 'AlertDialogCancel'
