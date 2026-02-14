import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import StockBadge from '../components/StockBadge'
import Currency from '../components/Currency'
import { useShop } from '../context/ShopContext'

function CatalogCard({ product, onAdd }) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '')
  const [quantity, setQuantity] = useState(1)

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) || product.variants[0]

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-slate-500">{product.category}</p>
          </div>
          <span className="text-base font-semibold text-slate-800">
            <Currency value={product.price} />
          </span>
        </div>

        <p className="text-sm text-slate-600">{product.description}</p>

        <label className="text-sm font-medium text-slate-700" htmlFor={`${product.id}-variant`}>
          Variant
        </label>
        <select
          id={`${product.id}-variant`}
          value={selectedVariantId}
          onChange={(event) => setSelectedVariantId(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {product.variants.map((variant) => (
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
            className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm"
          />
        </div>

        <button
          type="button"
          disabled={!selectedVariant || selectedVariant.stock <= 0}
          onClick={() => onAdd(product, selectedVariant, quantity)}
          className="mt-auto rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
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
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shop the latest drops</h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse products, choose variants, and check live stock before checkout.
          </p>
        </div>
        <Link
          to="/cart"
          className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Go to cart
        </Link>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => setFilters({ search: event.target.value })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          placeholder="Search products..."
        />
        <select
          value={filters.category}
          onChange={(event) => setFilters({ category: event.target.value })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
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
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No products match your filters.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <CatalogCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      )}
    </section>
  )
}
