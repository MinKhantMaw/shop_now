import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Loader from '../components/Loader'
import ProductSkeleton from '../components/ProductSkeleton'
import StockBadge from '../components/StockBadge'
import Currency from '../components/Currency'
import StarRating from '../components/StarRating'
import { useShop } from '../context/ShopContext'

function CatalogCard({ product, onAdd, view = 'grid' }) {
  const variants = Array.isArray(product.variants) ? product.variants : []
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || '')
  const [quantity, setQuantity] = useState(1)
  const isList = view === 'list'

  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) || variants[0]

  return (
    <article
      className={`group surface-elevated relative overflow-hidden border-teal-100/70 ${isList ? 'grid gap-0 md:grid-cols-[240px_1fr]' : 'flex h-full flex-col'}`}
    >
      <img
        src={product.image}
        alt={product.name}
        className={`${isList ? 'h-full min-h-[220px] w-full' : 'h-48 w-full'} object-cover`}
      />
      <div className={`${isList ? 'p-6' : 'p-5'} flex flex-1 flex-col gap-4`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{product.category}</p>
            <div className="mt-1">
              <StarRating rating={4.5} reviews={132} />
            </div>
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

        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <Link to={`/products/${product.id}`} className="btn-muted w-full text-center">
            Quick view
          </Link>
          <button
            type="button"
            disabled={!selectedVariant || selectedVariant.stock <= 0}
            onClick={() => onAdd(product, selectedVariant, quantity)}
            className="btn-brand w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Add to cart
          </button>
        </div>
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
  const [searchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState('grid')
  const [priceRange, setPriceRange] = useState('all')
  const [ratingRange, setRatingRange] = useState('all')
  const [brand, setBrand] = useState('all')
  const [urlCategoryApplied, setUrlCategoryApplied] = useState(false)

  useEffect(() => {
    if (urlCategoryApplied) return
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setFilters({ category: categoryFromUrl })
      setUrlCategoryApplied(true)
    }
  }, [categories, searchParams, setFilters, urlCategoryApplied])

  const listedProducts = useMemo(() => {
    let next = [...filteredProducts]

    if (priceRange === 'under-50') next = next.filter((item) => item.price < 50)
    if (priceRange === '50-100') next = next.filter((item) => item.price >= 50 && item.price <= 100)
    if (priceRange === '100-plus') next = next.filter((item) => item.price > 100)

    if (ratingRange !== 'all') {
      const minRating = Number(ratingRange)
      next = next.filter(() => 4.6 >= minRating)
    }

    if (brand !== 'all') {
      next = next.filter((item) => item.name.toLowerCase().includes(brand.toLowerCase()))
    }

    if (sortBy === 'price-asc') next.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') next.sort((a, b) => b.price - a.price)
    if (sortBy === 'newest') next.sort((a, b) => String(b.id).localeCompare(String(a.id)))

    return next
  }, [brand, filteredProducts, priceRange, ratingRange, sortBy])

  return (
    <section className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />

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

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="surface-card h-fit space-y-4 border-teal-100/70 p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Filters</h2>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            placeholder="Search products..."
          />
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Categories</label>
            <select
              value={filters.category}
              onChange={(event) => setFilters({ category: event.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Price range</label>
            <select
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            >
              <option value="all">All prices</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-plus">$100+</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Ratings</label>
            <select
              value={ratingRange}
              onChange={(event) => setRatingRange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            >
              <option value="all">All ratings</option>
              <option value="4">4 stars & up</option>
              <option value="5">5 stars</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Brands</label>
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            >
              <option value="all">All brands</option>
              <option value="nimbus">Nimbus</option>
              <option value="arc">Arc</option>
              <option value="terra">Terra</option>
              <option value="studio">Studio</option>
              <option value="xiaomi">Xiaomi</option>
            </select>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(event) => setFilters({ inStockOnly: event.target.checked })}
              className="h-4 w-4"
            />
            In-stock only
          </label>
        </aside>

        <div className="space-y-4">
          <div className="surface-card flex flex-wrap items-center justify-between gap-3 border-teal-100/70 p-3">
            <p className="text-sm font-medium text-slate-600">{listedProducts.length} products found</p>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Sort: Price low to high</option>
                <option value="price-desc">Sort: Price high to low</option>
              </select>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-sm ${viewMode === 'grid' ? 'bg-teal-700 text-white' : 'text-slate-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
                <button
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-teal-700 text-white' : 'text-slate-600'}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {productsLoading ? (
            <>
              <Loader label="Loading product catalog..." />
              <ProductSkeleton count={8} />
            </>
          ) : listedProducts.length === 0 ? (
            <div className="surface-card rounded-xl border-dashed border-slate-300 p-8 text-center text-slate-500">
              No products match your filters.
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
              {listedProducts.map((product) => (
                <CatalogCard key={product.id} product={product} onAdd={addToCart} view={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
