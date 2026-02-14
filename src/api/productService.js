import apiClient from './client'
import { mockProducts } from './mockData'

export async function fetchProducts() {
  try {
    const response = await apiClient.get('/products')
    return response.data?.data || response.data || []
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockProducts
  }
}
