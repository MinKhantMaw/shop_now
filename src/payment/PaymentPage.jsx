import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
      <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold">Checkout step required</h1>
        <p className="text-slate-600">Complete checkout before initiating payment.</p>
        <Link
          to="/checkout"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
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
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Payment</h1>
        <p className="text-sm text-slate-600">Select payment method and confirm transaction.</p>

        <div className="space-y-2">
          {methods.map((entry) => (
            <label
              key={entry.id}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
                method === entry.id
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 hover:border-slate-500'
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
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {paymentStatus.loading ? 'Processing payment...' : 'Pay now'}
        </button>
      </div>

      <aside className="h-fit space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
