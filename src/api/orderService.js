import apiClient from './client'
import { trackingTimeline } from './mockData'

export async function createOrder(payload) {
  try {
    const response = await apiClient.post('/orders', payload)
    return response.data?.data || response.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      id: `ord_${Date.now()}`,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      tracking: trackingTimeline,
      ...payload,
    }
  }
}

export async function fetchOrderById(orderId) {
  try {
    const response = await apiClient.get(`/orders/${orderId}`)
    return response.data?.data || response.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 350))
    return {
      id: orderId,
      status: 'In Transit',
      createdAt: new Date().toISOString(),
      tracking: trackingTimeline,
    }
  }
}
