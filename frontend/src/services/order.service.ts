import api from './api'
import type { Order } from '@/types'

export const orderService = {
  async createOrder(payload: {
    shippingAddressId: string
    notes?: string
  }): Promise<Order> {
    const { data } = await api.post('/orders', payload)
    return data
  },

  async getOrders(): Promise<Order[]> {
    const { data } = await api.get('/orders')
    return data.data ? data.data : data
  },

  async getOrder(id: string): Promise<Order> {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },

  // Admin
  async getAllOrders(params?: { status?: string; page?: number; limit?: number }) {
    const { data } = await api.get('/admin/orders', { params })
    return data
  },

  async updateOrderStatus(id: string, status: string, note?: string) {
    const { data } = await api.patch(`/admin/orders/${id}/status`, { status, note })
    return data
  },

  async processRefund(id: string) {
    const { data } = await api.post(`/admin/orders/${id}/refund`)
    return data
  },
}
