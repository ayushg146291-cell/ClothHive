// Framer Motion animation variants for ClothHive
import type { Variants } from 'framer-motion'

// Page transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: 0.2 },
  },
}

// Staggered container
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

// Product card animations
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  hover: {
    y: -6,
    scale: 1.025,
    transition: { type: 'spring', stiffness: 400, damping: 22 },
  },
}

// Cart drawer slide-in from right
export const cartDrawerVariants: Variants = {
  closed: { x: '100%', opacity: 0.8 },
  open: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 32, mass: 0.9 },
  },
  exit: {
    x: '100%',
    opacity: 0.8,
    transition: { type: 'spring', stiffness: 400, damping: 40 },
  },
}

// Cart overlay backdrop
export const backdropVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

// Cart item list entry/exit
export const cartItemVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: {
    opacity: 0,
    x: -60,
    height: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: { duration: 0.28, ease: 'easeInOut' },
  },
}

// Toast notifications
export const toastVariants: Variants = {
  initial: { opacity: 0, y: -20, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
}

// Modal / dialog
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 28 },
  },
  exit: { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.2 } },
}

// Filter panel accordion height
export const filterPanelVariants: Variants = {
  collapsed: { height: 0, opacity: 0, overflow: 'hidden' },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { height: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }, opacity: { duration: 0.2 } },
  },
}

// Admin sidebar
export const sidebarVariants: Variants = {
  collapsed: { width: 68 },
  expanded: { width: 240, transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

// Order timeline dot pulse
export const timelineDotVariants: Variants = {
  inactive: { scale: 1, boxShadow: 'none' },
  active: {
    scale: [1, 1.4, 1.2],
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// Fade up (generic)
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// Scale pop (wishlist heart)
export const scalePop: Variants = {
  idle: { scale: 1 },
  pop: {
    scale: [1, 1.4, 0.9, 1.1, 1],
    transition: { duration: 0.4 },
  },
}

// Button press
export const buttonPress = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
}

// Spring configs
export const springs = {
  addToCart: { type: 'spring' as const, stiffness: 300, damping: 15, mass: 0.8 },
  smooth: { type: 'spring' as const, stiffness: 250, damping: 28 },
  snappy: { type: 'spring' as const, stiffness: 450, damping: 30 },
}
