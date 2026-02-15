import apiClient from './client'

const addressesPath = import.meta.env.VITE_CUSTOMER_ADDRESSES_PATH || '/addresses'
const profilePath = import.meta.env.VITE_CUSTOMER_PROFILE_PATH || '/auth/customer/profile'

function normalizeAddress(address, index) {
  if (!address || typeof address !== 'object') return null

  const id = address.id ?? address.address_id ?? `addr-${index}`
  const label = address.label ?? address.type ?? address.name ?? 'Address'
  const recipient = address.recipient ?? address.full_name ?? address.contact_name ?? ''
  const line1 =
    address.line1 ??
    address.address_line_1 ??
    address.address1 ??
    address.street ??
    address.address ??
    ''
  const city = address.city ?? address.township ?? address.district ?? ''
  const state = address.state ?? address.region ?? address.province ?? ''
  const zip = address.zip ?? address.postal_code ?? address.zip_code ?? ''
  const country = address.country ?? address.country_code ?? 'US'

  if (!line1 && !city && !state && !zip) return null

  return {
    id,
    label,
    recipient,
    line1,
    city,
    state,
    zip,
    country,
  }
}

function extractAddressList(payload) {
  const collection =
    payload?.data?.addresses ||
    payload?.addresses ||
    payload?.data ||
    payload

  if (!Array.isArray(collection)) return []
  return collection.map(normalizeAddress).filter(Boolean)
}

async function fetchAddressFromProfile() {
  const response = await apiClient.get(profilePath)
  const customer = response.data?.data || response.data
  const fallback = normalizeAddress(
    {
      id: customer?.id ? `profile-${customer.id}` : 'profile',
      label: 'Default address',
      recipient: customer?.name,
      address: customer?.address,
    },
    0,
  )
  return fallback ? [fallback] : []
}

export async function fetchAddresses() {
  try {
    const response = await apiClient.get(addressesPath)
    const addresses = extractAddressList(response.data)
    if (addresses.length > 0) return addresses

    return await fetchAddressFromProfile()
  } catch {
    try {
      return await fetchAddressFromProfile()
    } catch {
      return []
    }
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
