import apiClient from './client'

const loginPath = import.meta.env.VITE_CUSTOMER_LOGIN_PATH || '/auth/customer/login'
const profilePath = import.meta.env.VITE_CUSTOMER_PROFILE_PATH || '/auth/customer/profile'

function extractToken(payload) {
  if (!payload || typeof payload !== 'object') return ''

  const token =
    payload.token ||
    payload.access_token ||
    payload.accessToken ||
    payload?.data?.token ||
    payload?.data?.access_token ||
    payload?.data?.accessToken

  return typeof token === 'string' ? token : ''
}

function extractCustomer(payload) {
  if (!payload || typeof payload !== 'object') return null

  const customer = payload.customer || payload.user || payload.profile || payload?.data?.customer
  if (!customer || typeof customer !== 'object') return null
  return customer
}

export async function loginCustomer(credentials) {
  const response = await apiClient.post(loginPath, credentials)
  const body = response.data
  const token = extractToken(body)

  if (!token) {
    throw new Error('Login succeeded but no token was returned by API.')
  }

  return {
    token,
    customer: extractCustomer(body),
    raw: body,
  }
}

export async function fetchCustomerProfile() {
  const response = await apiClient.get(profilePath)
  const body = response.data
  return extractCustomer(body) || extractCustomer(body?.data) || body?.data || body
}

export async function updateCustomerProfile(payload) {
  const hasFile = payload?.profile_image instanceof File
  let response

  if (hasFile) {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        formData.append(key, '')
      } else {
        formData.append(key, value)
      }
    })
    formData.append('_method', 'PUT')
    response = await apiClient.post(profilePath, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  } else {
    response = await apiClient.put(profilePath, payload)
  }

  const body = response.data
  return extractCustomer(body) || extractCustomer(body?.data) || body?.data || body
}
