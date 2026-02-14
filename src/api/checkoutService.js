import apiClient from './client'
import { mockAddresses } from './mockData'

export async function fetchAddresses() {
  try {
    const response = await apiClient.get('/addresses')
    return response.data?.data || response.data || []
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockAddresses
  }
}

export async function submitCheckout(payload) {
  try {
    const response = await apiClient.post('/checkout', payload)
    return response.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      checkoutId: `chk_${Date.now()}`,
      ...payload,
    }
  }
}
