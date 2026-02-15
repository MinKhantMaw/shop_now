import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Currency from '../components/Currency'
import { useShop } from '../context/ShopContext'

const methods = [
  { id: 'card', label: 'Credit or debit card' },
  { id: 'wallet', label: 'Digital wallet' },
  { id: 'bank', label: 'Bank transfer' },
]

export default function PaymentPage() {
  const navigate = useNavigate()
  const [method, setMethod] = useState(methods[0].id)
  const { checkoutSnapshot, paymentStatus, startPayment } = useShop()

  if (!checkoutSnapshot) {
    return (
      <section className="surface-elevated mx-auto max-w-xl space-y-4 border-teal-100/70 p-8 text-center">
        <h1 className="text-2xl font-bold">Checkout step required</h1>
        <p className="text-slate-600">Complete checkout before initiating payment.</p>
        <Link to="/checkout" className="btn-brand">
          Go to checkout
        </Link>
      </section>
    )
  }

  async function onPayNow() {
    const result = await startPayment(method)
    if (result.ok && result.orderId) {
      navigate(`/orders/${result.orderId}`)
    }
  }

  return (
    <section className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="lg:col-span-2 space-y-4">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Cart', to: '/cart' },
            { label: 'Checkout', to: '/checkout' },
            { label: 'Payment' },
          ]}
        />
        <div className="surface-card flex flex-wrap items-center gap-3 border-teal-100/70 p-3 text-sm">
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">1. Shipping</span>
          <span className="rounded-full bg-teal-700 px-3 py-1 font-semibold text-white">2. Payment</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500">3. Confirmation</span>
        </div>
      </div>

      <div className="surface-elevated space-y-4 border-teal-100/70 p-6">
        <h1 className="page-title text-2xl">Payment</h1>
        <p className="text-sm text-slate-600">Select payment method and confirm transaction.</p>

        <div className="space-y-2">
          {methods.map((entry) => (
            <label
              key={entry.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                method === entry.id
                  ? 'border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white shadow-md'
                  : 'border-slate-300 bg-slate-50/60 hover:border-teal-400'
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={entry.id}
                checked={method === entry.id}
                onChange={(event) => setMethod(event.target.value)}
              />
              {entry.label}
            </label>
          ))}
        </div>

        {paymentStatus.error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {paymentStatus.error}
          </p>
        )}

        <button
          type="button"
          disabled={paymentStatus.loading}
          onClick={onPayNow}
          className="btn-brand w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {paymentStatus.loading ? 'Processing payment...' : 'Pay now'}
        </button>
      </div>

      <aside className="surface-elevated h-fit space-y-3 border-teal-100/70 p-6">
        <h2 className="text-lg font-semibold">Final summary</h2>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{checkoutSnapshot.items.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Ship to</span>
            <span className="text-right">{checkoutSnapshot.addressLabel}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
            <span>Total due</span>
            <span>
              <Currency value={checkoutSnapshot.total} />
            </span>
          </div>
        </div>
      </aside>
    </section>
  )
}
