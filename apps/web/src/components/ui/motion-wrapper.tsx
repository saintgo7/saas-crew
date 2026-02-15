'use client'

import { motion } from 'framer-motion'
import { fadeInUp, viewportOnce } from '@/lib/motion'
import type { Variants, HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionSectionProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  children: ReactNode
  variants?: Variants
  className?: string
}

export function MotionSection({
  children,
  variants = fadeInUp,
  className,
  ...props
}: MotionSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
}
