import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/types'

interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggle: (product: Product) => void
  isInWishlist: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          set((state) => ({ items: [...state.items, product] }))
        }
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== productId) })),

      toggle: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      isInWishlist: (productId) => get().items.some((p) => p.id === productId),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'clothhive-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
