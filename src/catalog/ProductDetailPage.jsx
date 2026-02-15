import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Currency from '../components/Currency'
import StarRating from '../components/StarRating'
import StockBadge from '../components/StockBadge'
import { useShop } from '../context/ShopContext'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const { products, addToCart } = useShop()
  const product = products.find((entry) => String(entry.id) === String(productId))
  const variants = Array.isArray(product?.variants) ? product.variants : []
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || '')
  const [quantity, setQuantity] = useState(1)
  const [imageIndex, setImageIndex] = useState(0)

  const selectedVariant = variants.find((entry) => entry.id === selectedVariantId) || variants[0]
  const gallery = useMemo(() => [product?.image, product?.image, product?.image].filter(Boolean), [product?.image])
  const related = products
    .filter((entry) => entry.id !== product?.id && entry.category === product?.category)
    .slice(0, 4)

  if (!product) {
    return (
      <section className="surface-elevated mx-auto max-w-xl space-y-4 p-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/shop" className="btn-brand">
          Back to products
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: product.name }]} />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-4">
          <div className="surface-elevated group overflow-hidden">
            <img
              src={gallery[imageIndex]}
              alt={product.name}
              className="h-[380px] w-full object-cover transition duration-500 group-hover:scale-110 md:h-[520px]"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setImageIndex(index)}
                className={`overflow-hidden rounded-xl border ${imageIndex === index ? 'border-teal-600' : 'border-slate-200'}`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <article className="surface-elevated space-y-5 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{product.category}</p>
          <h1 className="text-3xl font-extrabold text-slate-900">{product.name}</h1>
          <StarRating rating={4.7} reviews={126} />
          <p className="text-3xl font-extrabold text-teal-800">
            <Currency value={product.price} />
          </p>
          <p className="text-sm leading-7 text-slate-600">{product.description}</p>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Variant</span>
              <StockBadge stock={selectedVariant?.stock || 0} />
            </div>
            <select
              value={selectedVariantId}
              onChange={(event) => setSelectedVariantId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
            >
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.label}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                min="1"
                max={selectedVariant?.stock || 1}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                onClick={() => addToCart(product, selectedVariant, quantity)}
                className="btn-brand w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                Add to cart
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Specifications</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li>Premium material finish</li>
              <li>Secure packaging and fast shipping</li>
              <li>Quality checked before dispatch</li>
            </ul>
          </div>
        </article>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Related products</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((entry) => (
            <Link key={entry.id} to={`/products/${entry.id}`} className="surface-elevated overflow-hidden">
              <img src={entry.image} alt={entry.name} className="h-40 w-full object-cover" />
              <div className="space-y-2 p-4">
                <h3 className="font-semibold text-slate-900">{entry.name}</h3>
                <p className="text-sm font-semibold text-teal-800">
                  <Currency value={entry.price} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

