import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isAuthenticated, setAuthToken } from './auth'
import { loginCustomer } from '../api/authService'

function toSafeInternalPath(target) {
  if (typeof target !== 'string') return '/'
  if (!target.startsWith('/')) return '/'
  if (target.startsWith('//')) return '/'
  return target
}

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = useMemo(() => {
    const from = location.state?.from
    const pathname = from?.pathname || '/profile'
    const search = from?.search || ''
    const hash = from?.hash || ''
    return toSafeInternalPath(`${pathname}${search}${hash}`)
  }, [location.state])

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirectTo, { replace: true })
    }
  }, [navigate, redirectTo])

  async function onSubmit(event) {
    event.preventDefault()
    const nextEmail = email.trim()

    if (!nextEmail || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await loginCustomer({ email: nextEmail, password })
      setAuthToken(result.token)
      navigate(redirectTo, { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="surface-elevated mx-auto max-w-md border-teal-100/70 p-7">
      <h1 className="page-title text-2xl">Login</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sign in as customer to continue checkout.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
        </label>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-brand w-full"
        >
          {loading ? 'Signing in...' : 'Continue'}
        </button>
      </form>

      <Link to="/shop" className="mt-5 inline-block text-sm font-semibold text-teal-700 hover:text-teal-900">
        Back to catalog
      </Link>
    </section>
  )
}
