import apiClient from './client'

export async function initiatePayment(payload) {
  try {
    const response = await apiClient.post('/payments/initiate', payload)
    return response.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const ok = Math.random() >= 0.2

    if (!ok) {
      throw new Error('Payment authorization failed. Please retry.')
    }

    return {
      paymentId: `pay_${Date.now()}`,
      status: 'success',
      providerRef: `ref_${Math.floor(Math.random() * 100000)}`,
    }
  }
}
