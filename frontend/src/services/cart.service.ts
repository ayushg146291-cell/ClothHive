import api from './api'
import type { Cart, CartItem } from '@/types'

export const cartService = {
  async getCart(): Promise<Cart> {
    const { data } = await api.get('/cart')
    return data
  },

  async addItem(productId: string, quantity: number, variantId?: string): Promise<CartItem> {
    const { data } = await api.post('/cart/items', { productId, quantity, variantId })
    return data
  },

  async updateItem(itemId: string, quantity: number): Promise<CartItem> {
    const { data } = await api.patch(`/cart/items/${itemId}`, { quantity })
    return data
  },

  async removeItem(itemId: string): Promise<void> {
    await api.delete(`/cart/items/${itemId}`)
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart')
  },

  async mergeGuestCart(guestCartId: string): Promise<Cart> {
    const { data } = await api.post('/cart/merge', { guestCartId })
    return data
  },
}
