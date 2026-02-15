import { Link, useParams } from 'react-router-dom'
import Currency from '../components/Currency'
import { useShop } from '../context/ShopContext'

function normalizeStatus(status) {
  if (!status) return 'Pending'
  return String(status)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function statusBadgeClass(status) {
  const key = String(status || '')
    .toLowerCase()
    .replace(/\s+/g, '_')

  if (['paid', 'completed', 'delivered', 'success'].includes(key)) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
  if (['processing', 'pending', 'in_transit', 'shipped'].includes(key)) {
    return 'bg-amber-100 text-amber-800 border-amber-200'
  }
  if (['failed', 'cancelled', 'refunded'].includes(key)) {
    return 'bg-rose-100 text-rose-800 border-rose-200'
  }
  return 'bg-slate-100 text-slate-800 border-slate-200'
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const { latestOrder } = useShop()

  if (!latestOrder || latestOrder.id !== orderId) {
    return (
      <section className="surface-elevated mx-auto max-w-xl space-y-4 border-teal-100/70 p-8 text-center">
        <h1 className="text-2xl font-bold">Order not available</h1>
        <p className="text-slate-600">
          We could not find this order in your current session. Please check your orders list.
        </p>
        <Link to="/" className="btn-brand">
          Back to catalog
        </Link>
      </section>
    )
  }

  const status = latestOrder.status || latestOrder.order_status || 'Pending'
  const orderDate = latestOrder.updated_at || latestOrder.created_at || latestOrder.createdAt

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">Payment complete</p>
        <h1 className="mt-1 text-2xl font-bold text-emerald-900">Thank you for your order.</h1>
        <p className="mt-2 text-sm text-emerald-800">Order ID: {latestOrder.id}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-emerald-900">Order status:</span>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(status)}`}>
            {normalizeStatus(status)}
          </span>
        </div>
        {orderDate && (
          <p className="mt-2 text-xs text-emerald-800/90">
            Updated: {new Date(orderDate).toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="surface-elevated space-y-3 border-teal-100/70 p-5">
          <h2 className="text-lg font-semibold">Receipt</h2>
          <div className="space-y-2 text-sm text-slate-600">
            {latestOrder.items?.map((item) => (
              <div key={item.key} className="flex justify-between gap-3">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>
                  <Currency value={item.price * item.quantity} />
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
              <span>Total paid</span>
              <span>
                <Currency value={latestOrder.total || 0} />
              </span>
            </div>
          </div>
        </article>

        <article className="surface-elevated space-y-3 border-teal-100/70 p-5">
          <h2 className="text-lg font-semibold">Tracking status</h2>
          <ol className="space-y-2 text-sm text-slate-700">
            {(latestOrder.tracking || []).map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-800 text-xs text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>
      </div>

      <Link to="/" className="btn-brand">
        Continue shopping
      </Link>
    </section>
  )
}
