import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'

interface Sparkle {
  id: string
  createdAt: number
  color: string
  size: number
  style: any
}

const DEFAULT_COLOR = '#FFC700'
const generateSparkle = (color: string = DEFAULT_COLOR): Sparkle => {
  const spin = Math.random() < 0.5 ? 'animate-spin' : 'animate-spin-reverse'
  const size = Math.random() * 10 + 10
  return {
    id: String(Math.random() * 10000),
    createdAt: Date.now(),
    color,
    size,
    style: {
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      zIndex: 1,
    },
  }
}

interface SparklesProps {
  color?: string
  children: React.ReactNode
  className?: string
}

export function Sparkles({ color = DEFAULT_COLOR, children, className = '' }: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const sparkle = generateSparkle(color)
      const now = Date.now()
      setSparkles((current) => [...current, sparkle].filter((sp) => now - sp.createdAt < 750))
    }, 250)

    return () => clearInterval(interval)
  }, [color])

  return (
    <div className={`relative inline-block ${className}`}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="pointer-events-none absolute block"
          style={sparkle.style}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 180 }}
          exit={{ scale: 0, rotate: 360 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
              fill={sparkle.color}
            />
          </svg>
        </motion.div>
      ))}
      <div className="relative z-10 font-bold">{children}</div>
    </div>
  )
}
