// App-wide constants for ClothHive

export const APP_NAME = 'ClothHive'
export const APP_DESCRIPTION = 'Premium fashion, delivered fast.'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  PAID: '#3b82f6',
  PROCESSING: '#8b5cf6',
  SHIPPED: '#6366f1',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
  REFUNDED: '#94a3b8',
}

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Sellers', value: 'bestseller' },
  { label: 'Top Rated', value: 'rating' },
]

export const ITEMS_PER_PAGE = 24

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Sale', href: '/shop?sale=true' },
]

export const CLOUDINARY_BASE = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`
