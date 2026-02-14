import { Link, useParams } from 'react-router-dom'
import Currency from '../components/Currency'
import { useShop } from '../context/ShopContext'

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const { latestOrder } = useShop()

  if (!latestOrder || latestOrder.id !== orderId) {
    return (
      <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Order not available</h1>
        <p className="text-slate-600">
          We could not find this order in your current session. Please check your orders list.
        </p>
        <Link
          to="/"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Back to catalog
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">Payment complete</p>
        <h1 className="mt-1 text-2xl font-bold text-emerald-900">Thank you for your order.</h1>
        <p className="mt-2 text-sm text-emerald-800">Order ID: {latestOrder.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

        <article className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Tracking status</h2>
          <ol className="space-y-2 text-sm text-slate-700">
            {(latestOrder.tracking || []).map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>
      </div>

      <Link
        to="/"
        className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Continue shopping
      </Link>
    </section>
  )
}
