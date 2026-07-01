import api from './api'
import type { Product, PaginatedResponse, ProductQuery } from '@/types'

export const productService = {
  async getProducts(params: ProductQuery): Promise<PaginatedResponse<Product>> {
    const { data } = await api.get('/products', { params })
    return data
  },

  async getProduct(slug: string): Promise<Product> {
    const { data } = await api.get(`/products/${slug}`)
    return data
  },

  async getCategories() {
    const { data } = await api.get('/categories')
    return data
  },

  async search(query: string, params?: Omit<ProductQuery, 'search'>) {
    const { data } = await api.get('/search', { params: { q: query, ...params } })
    return data
  },

  async getFeatured(): Promise<Product[]> {
    const { data } = await api.get('/products', { params: { isFeatured: true, limit: 8 } })
    return data.data
  },

  async createProduct(payload: FormData) {
    const { data } = await api.post('/products', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async updateProduct(id: string, payload: Partial<Product>) {
    const { data } = await api.patch(`/products/${id}`, payload)
    return data
  },

  async deleteProduct(id: string) {
    await api.delete(`/products/${id}`)
  },
}
