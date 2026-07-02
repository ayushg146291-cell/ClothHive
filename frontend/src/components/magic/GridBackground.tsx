import { cn } from '@/lib/utils'
import React from 'react'

interface GridBackgroundProps {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
}

export function GridBackground({ children, className, containerClassName }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center bg-black dark:bg-black',
        containerClassName
      )}
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_20%,#000_100%)]" />

      {/* Content */}
      <div className={cn('relative z-10 w-full', className)}>{children}</div>
    </div>
  )
}
