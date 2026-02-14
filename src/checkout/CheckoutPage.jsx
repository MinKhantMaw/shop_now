import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Currency from '../components/Currency'
import Loader from '../components/Loader'
import { useShop } from '../context/ShopContext'

function AddressCard({ address, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(address.id)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
      }`}
    >
      <p className="text-sm font-medium uppercase tracking-wide opacity-80">{address.label}</p>
      <p className="mt-1 font-semibold">{address.recipient}</p>
      <p className="text-sm opacity-80">{address.line1}</p>
      <p className="text-sm opacity-80">
        {address.city}, {address.state} {address.zip}
      </p>
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
      <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold">No items to checkout</h1>
        <p className="text-slate-600">Your cart is empty. Add products before checkout.</p>
        <Link
          to="/"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
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
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-sm text-slate-600">Select delivery address and confirm your order.</p>

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

      <aside className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? 'Validating order...' : 'Continue to payment'}
        </button>
      </aside>
    </section>
  )
}
