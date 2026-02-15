import { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import { fetchCustomerProfile, updateCustomerProfile } from '../api/authService'

function toEditableProfile(customer) {
  return {
    name: customer?.name || '',
    email: customer?.email || '',
    mobile_country_code: customer?.mobile_country_code || '',
    mobile_number: customer?.mobile_number || '',
    address: customer?.address || '',
  }
}

function resolveProfileImageUrl(profileImage) {
  if (!profileImage) return ''
  if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) return profileImage

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
  const origin = new URL(apiBase).origin
  return `${origin}${profileImage.startsWith('/') ? '' : '/'}${profileImage}`
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [customer, setCustomer] = useState(null)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile_country_code: '',
    mobile_number: '',
    address: '',
  })

  useEffect(() => {
    if (!profileImageFile) {
      setPreviewUrl('')
      return
    }

    const nextPreviewUrl = URL.createObjectURL(profileImageFile)
    setPreviewUrl(nextPreviewUrl)

    return () => {
      URL.revokeObjectURL(nextPreviewUrl)
    }
  }, [profileImageFile])

  useEffect(() => {
    let active = true

    async function loadProfile() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchCustomerProfile()
        if (!active) return
        setCustomer(data)
        setForm(toEditableProfile(data))
      } catch (profileError) {
        if (!active) return
        setError(profileError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()
    return () => {
      active = false
    }
  }, [])

  function onChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function onImageChange(event) {
    const file = event.target.files?.[0] || null
    setProfileImageFile(file)
  }

  async function onSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile_country_code: form.mobile_country_code.trim() || null,
        mobile_number: form.mobile_number.trim() || null,
        address: form.address.trim() || null,
      }
      if (profileImageFile) {
        payload.profile_image = profileImageFile
      }
      const updated = await updateCustomerProfile(payload)
      setCustomer(updated)
      setForm(toEditableProfile(updated))
      setProfileImageFile(null)
      setSuccess('Profile updated successfully.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader label="Loading your profile..." />
  }

  const roleNames = Array.isArray(customer?.roles) ? customer.roles.map((role) => role.name) : []
  const profileImageUrl = previewUrl || resolveProfileImageUrl(customer?.profile_image)

  return (
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1.2fr]">
      <aside className="surface-elevated space-y-3 border-teal-100/70 p-5">
        <h1 className="page-title text-2xl">My profile</h1>
        <p className="text-sm text-slate-600">Your customer account details.</p>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="mb-4 flex items-center gap-3">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={`${customer?.name || 'Customer'} profile`}
                className="h-16 w-16 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-500">
                No image
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900">{customer?.name || '-'}</p>
              <p className="text-xs text-slate-500">{customer?.email || '-'}</p>
            </div>
          </div>

          <p>
            <span className="font-medium text-slate-900">Customer ID:</span> {customer?.id || '-'}
          </p>
          <p className="mt-2">
            <span className="font-medium text-slate-900">Status:</span>{' '}
            {customer?.status || '-'}
          </p>
          <p className="mt-2">
            <span className="font-medium text-slate-900">Mobile:</span>{' '}
            {customer?.mobile_country_code || ''}
            {customer?.mobile_country_code && customer?.mobile_number ? ' ' : ''}
            {customer?.mobile_number || '-'}
          </p>
          <p className="mt-2">
            <span className="font-medium text-slate-900">Address:</span> {customer?.address || '-'}
          </p>
          {roleNames.length > 0 && (
            <p className="mt-2">
              <span className="font-medium text-slate-900">Roles:</span> {roleNames.join(', ')}
            </p>
          )}
          {customer?.created_at && (
            <p className="mt-2">
              <span className="font-medium text-slate-900">Joined:</span>{' '}
              {new Date(customer.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </aside>

      <form onSubmit={onSubmit} className="surface-elevated space-y-4 border-teal-100/70 p-5">
        <h2 className="text-lg font-semibold">Update information</h2>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Country code</span>
          <input
            type="text"
            name="mobile_country_code"
            value={form.mobile_country_code}
            onChange={onChange}
            placeholder="+95"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Mobile number</span>
          <input
            type="text"
            name="mobile_number"
            value={form.mobile_number}
            onChange={onChange}
            placeholder="9xxxxxxxx"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Profile image</span>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
          <span className="mt-1 block text-xs text-slate-500">Optional: leave empty to keep current image.</span>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Address</span>
          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            rows={3}
            placeholder="Your full address"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
        </label>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        {success && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-brand w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </section>
  )
}
