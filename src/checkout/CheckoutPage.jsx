import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
        <Link to="/" className="btn-brand">
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
      <div className="surface-elevated space-y-4 border-teal-100/70 p-5">
        <h1 className="page-title text-2xl">Checkout</h1>
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
