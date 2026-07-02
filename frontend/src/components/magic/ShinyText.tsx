import { cn } from '@/lib/utils'

interface ShinyTextProps {
  text: string
  className?: string
  shimmerWidth?: number
}

export function ShinyText({ text, className, shimmerWidth = 100 }: ShinyTextProps) {
  return (
    <span
      className={cn(
        'mx-auto max-w-md text-transparent bg-clip-text bg-no-repeat animate-shimmer',
        className
      )}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: `${shimmerWidth}px 100%`,
        WebkitBackgroundClip: 'text',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {text}
    </span>
  )
}
