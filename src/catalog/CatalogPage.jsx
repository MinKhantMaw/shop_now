import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import StockBadge from '../components/StockBadge'
import Currency from '../components/Currency'
import { useShop } from '../context/ShopContext'

function CatalogCard({ product, onAdd }) {
  const variants = Array.isArray(product.variants) ? product.variants : []
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || '')
  const [quantity, setQuantity] = useState(1)

  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) || variants[0]

  return (
    <article className="surface-elevated flex h-full flex-col overflow-hidden border-teal-100/70">
      <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{product.category}</p>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-base font-bold text-teal-800">
            <Currency value={product.price} />
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-600">{product.description}</p>

        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor={`${product.id}-variant`}>
          Variant
        </label>
        <select
          id={`${product.id}-variant`}
          value={selectedVariantId}
          onChange={(event) => setSelectedVariantId(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.label}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-between">
          <StockBadge stock={selectedVariant?.stock || 0} />
          <input
            type="number"
            min="1"
            max={selectedVariant?.stock || 1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value) || 1)}
            className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm"
          />
        </div>

        <button
          type="button"
          disabled={!selectedVariant || selectedVariant.stock <= 0}
          onClick={() => onAdd(product, selectedVariant, quantity)}
          className="btn-brand mt-auto disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}

export default function CatalogPage() {
  const {
    productsLoading,
    filteredProducts,
    categories,
    filters,
    setFilters,
    addToCart,
  } = useShop()

  return (
    <section className="space-y-6">
      <div className="surface-elevated flex flex-col gap-4 border-teal-100/70 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="page-title">Shop the latest drops</h1>
          <p className="mt-2 text-sm text-slate-600">
            Browse products, choose variants, and check live stock before checkout.
          </p>
        </div>
        <Link
          to="/cart"
          className="btn-muted"
        >
          Go to cart
        </Link>
      </div>

      <div className="surface-card grid gap-4 border-teal-100/70 p-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => setFilters({ search: event.target.value })}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm md:col-span-2"
          placeholder="Search products..."
        />
        <select
          value={filters.category}
          onChange={(event) => setFilters({ category: event.target.value })}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(event) => setFilters({ inStockOnly: event.target.checked })}
            className="h-4 w-4"
          />
          In-stock only
        </label>
      </div>

      {productsLoading ? (
        <Loader label="Loading product catalog..." />
      ) : filteredProducts.length === 0 ? (
        <div className="surface-card rounded-xl border-dashed border-slate-300 p-8 text-center text-slate-500">
          No products match your filters.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <CatalogCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      )}
    </section>
  )
}
