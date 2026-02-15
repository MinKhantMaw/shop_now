import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Currency from '../components/Currency'
import Loader from '../components/Loader'
import { useShop } from '../context/ShopContext'

function AddressCard({ address, selected, onSelect }) {
  const cityStateZip = [address.city, address.state, address.zip].filter(Boolean).join(', ')

  return (
    <button
      type="button"
      onClick={() => onSelect(address.id)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? 'border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white shadow-md'
          : 'border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50/40'
      }`}
    >
      <p className="text-sm font-medium uppercase tracking-wide opacity-80">{address.label}</p>
      <p className="mt-1 font-semibold">{address.recipient}</p>
      <p className="text-sm opacity-80">{address.line1}</p>
      {cityStateZip && <p className="text-sm opacity-80">{cityStateZip}</p>}
    </button>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const {
    cart,
    addresses,
    addressesLoading,
    selectedAddressId,
    setSelectedAddress,
    cartSubtotal,
    cartTax,
    shippingFee,
    cartTotal,
    prepareCheckout,
  } = useShop()

  if (!cart.length) {
    return (
      <section className="surface-elevated mx-auto max-w-xl space-y-4 border-teal-100/70 p-8 text-center">
        <h1 className="text-2xl font-bold">No items to checkout</h1>
        <p className="text-slate-600">Your cart is empty. Add products before checkout.</p>
        <Link to="/shop" className="btn-brand">
          Return to catalog
        </Link>
      </section>
    )
  }

  async function handleContinue() {
    setSubmitting(true)
    const result = await prepareCheckout()
    setSubmitting(false)
    if (result.ok) {
      navigate('/payment')
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="lg:col-span-2 space-y-4">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
        <div className="surface-card flex flex-wrap items-center gap-3 border-teal-100/70 p-3 text-sm">
          <span className="rounded-full bg-teal-700 px-3 py-1 font-semibold text-white">1. Shipping</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500">2. Payment</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500">3. Confirmation</span>
        </div>
      </div>

      <div className="surface-elevated space-y-4 border-teal-100/70 p-5">
        <h1 className="page-title text-2xl">Checkout</h1>
        <p className="text-sm text-slate-600">Select delivery address and confirm your order.</p>

        <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
          <h2 className="md:col-span-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Shipping details</h2>
          <input type="text" placeholder="Full name" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" />
          <input type="text" placeholder="Phone number" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" />
          <input type="email" placeholder="Email address" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm md:col-span-2" />
          <input type="text" placeholder="Address line" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm md:col-span-2" />
          <input type="text" placeholder="City" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" />
          <input type="text" placeholder="Postal code" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" />
        </div>

        {addressesLoading ? (
          <Loader label="Loading addresses..." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                selected={selectedAddressId === address.id}
                onSelect={setSelectedAddress}
              />
            ))}
          </div>
        )}
      </div>

      <aside className="surface-elevated h-fit space-y-4 border-teal-100/70 p-5">
        <h2 className="text-lg font-semibold">Order summary</h2>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              <Currency value={cartSubtotal} />
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>
              <Currency value={cartTax} />
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              <Currency value={shippingFee} />
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>
              <Currency value={cartTotal} />
            </span>
          </div>
        </div>

        {!selectedAddressId && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            Please select a shipping address.
          </p>
        )}

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedAddressId || submitting}
          className="btn-brand w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {submitting ? 'Validating order...' : 'Continue to payment'}
        </button>
      </aside>
    </section>
  )
}
