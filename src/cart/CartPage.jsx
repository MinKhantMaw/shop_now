import { Link, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Currency from '../components/Currency'
import QuantityControl from '../components/QuantityControl'
import { useShop } from '../context/ShopContext'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    cart,
    cartSubtotal,
    cartTax,
    shippingFee,
    cartTotal,
    removeFromCart,
    updateCartQty,
    validateCart,
  } = useShop()

  const validationError = validateCart()

  if (!cart.length) {
    return (
      <section className="surface-elevated mx-auto max-w-2xl space-y-4 border-teal-100/70 p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="text-slate-600">Add products from the catalog to continue.</p>
        <Link to="/shop" className="btn-brand">
          Browse catalog
        </Link>
      </section>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="lg:col-span-2">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      </div>

      <div className="surface-elevated space-y-4 border-teal-100/70 p-5">
        <h1 className="page-title text-2xl">Shopping cart</h1>
        {cart.map((item) => (
          <article
            key={item.key}
            className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-full rounded-xl object-cover sm:h-16"
            />

            <div>
              <h2 className="font-bold text-slate-900">{item.name}</h2>
              <p className="text-sm text-slate-500">{item.variantLabel}</p>
              <p className="text-sm font-medium text-slate-700">
                <Currency value={item.price} /> each
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <QuantityControl
                value={item.quantity}
                max={item.stock}
                onChange={(quantity) => updateCartQty(item.key, quantity)}
              />
              <button
                type="button"
                onClick={() => removeFromCart(item.key)}
                className="text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                Remove
              </button>
            </div>

            {item.quantity > item.stock && (
              <p className="text-sm text-rose-600 sm:col-span-3">
                Quantity exceeds stock. Max available: {item.stock}.
              </p>
            )}
          </article>
        ))}
      </div>

      <aside className="surface-elevated h-fit space-y-3 border-teal-100/70 p-5">
        <h2 className="text-lg font-semibold">Order total</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>
              <Currency value={cartSubtotal} />
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Tax</span>
            <span>
              <Currency value={cartTax} />
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span>
              <Currency value={shippingFee} />
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>
              <Currency value={cartTotal} />
            </span>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Coupon code</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter code"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            />
            <button type="button" className="btn-muted whitespace-nowrap">
              Apply
            </button>
          </div>
        </div>

        {validationError && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{validationError}</p>
        )}

        <button
          type="button"
          disabled={Boolean(validationError)}
          onClick={() => navigate('/checkout')}
          className="btn-brand w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          Proceed to checkout
        </button>
      </aside>
    </section>
  )
}
