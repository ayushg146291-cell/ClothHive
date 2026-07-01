import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product, ProductVariant } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  // Actions
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  // Derived
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === product.id && i.variantId === variant?.id
          )

          if (existingIndex >= 0) {
            const updated = [...state.items]
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            }
            return { items: updated }
          }

          const newItem: CartItem = {
            id: `${product.id}-${variant?.id ?? 'default'}-${Date.now()}`,
            cartId: 'local',
            productId: product.id,
            product,
            variantId: variant?.id,
            variant,
            quantity,
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((acc, i) => {
          const price = i.variant?.price ?? i.product.price
          return acc + price * i.quantity
        }, 0),
    }),
    {
      name: 'clothhive-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
