import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  glareEnable?: boolean
}

export function TiltCard({ children, className, glareEnable = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring configuration for smooth tilt
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  // Map mouse position to rotation (-15deg to 15deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg'])

  // Map mouse position for glare effect
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareOpacity = useTransform(x, [-0.5, 0, 0.5], [0.5, 0, 0.5])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Normalize coordinates from -0.5 to 0.5
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {glareEnable && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 rounded-inherit"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 60%)',
            left: glareX,
            top: glareY,
            opacity: glareOpacity,
            transform: 'translate(-50%, -50%)',
            width: '200%',
            height: '200%',
          }}
        />
      )}
      {/* 3D Depth Content Wrapper */}
      <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  )
}
