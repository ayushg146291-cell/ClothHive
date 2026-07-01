// Shared TypeScript types for ClothHive frontend

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  provider: string
  providerId: string
  role: 'GUEST' | 'CUSTOMER' | 'ADMIN'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentId?: string
  children?: Category[]
}

export interface ProductVariant {
  id: string
  productId: string
  size?: string
  color?: string
  stock: number
  price?: number
  sku: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  sku: string
  stock: number
  images: string[]
  categoryId: string
  category: Category
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  variants: ProductVariant[]
  reviews?: Review[]
  avgRating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  userId: string
  user: Pick<User, 'id' | 'name' | 'email'>
  productId: string
  rating: number
  title?: string
  body?: string
  isVerified: boolean
  createdAt: string
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  product: Product
  variantId?: string
  variant?: ProductVariant
  quantity: number
}

export interface Cart {
  id: string
  userId?: string
  sessionId?: string
  items: CartItem[]
}

export interface Address {
  id: string
  userId: string
  label?: string
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  variantId?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  productSnapshot: Product
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user?: User
  status: OrderStatus
  paymentMethod: 'COD'
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  totalAmount: number
  shippingAddress: Address
  trackingNumber?: string
  trackingUrl?: string
  estimatedDelivery?: string
  notes?: string
  statusHistory: Array<{ status: OrderStatus; timestamp: string; note?: string }>
  createdAt: string
  updatedAt: string
}

export interface WishlistItem {
  id: string
  wishlistId: string
  productId: string
  product: Product
  addedAt: string
}

export interface Wishlist {
  id: string
  userId: string
  items: WishlistItem[]
}

// API response wrappers
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Query params
export interface ProductQuery {
  page?: number
  limit?: number
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'bestseller' | 'rating'
  tags?: string[]
  search?: string
  inStock?: boolean
  sale?: boolean
}
