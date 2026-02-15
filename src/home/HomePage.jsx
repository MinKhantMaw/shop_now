import { Link } from 'react-router-dom'
import Currency from '../components/Currency'
import StarRating from '../components/StarRating'
import ProductSkeleton from '../components/ProductSkeleton'
import { useShop } from '../context/ShopContext'

const testimonials = [
  { name: 'Mia R.', text: 'Fast delivery and premium quality. The whole checkout flow felt effortless.' },
  { name: 'Daniel K.', text: 'Great variety and clean shopping experience. Product details were super clear.' },
  { name: 'Sofia L.', text: 'Customer profile and address handling worked perfectly on mobile.' },
]

export default function HomePage() {
  const { products, productsLoading } = useShop()
  const featured = products.slice(0, 4)

  const categories = Array.from(
    new Map(
      products.map((product) => [
        product.category,
        { name: product.category, image: product.image, count: products.filter((p) => p.category === product.category).length },
      ]),
    ).values(),
  ).slice(0, 4)

  return (
    <section className="space-y-8">
      <div className="surface-elevated overflow-hidden border-teal-100/70 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-700 p-8 text-white lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">New Season Collection</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl">
          Minimal design. Premium essentials. Everyday performance.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-teal-50/90 md:text-base">
          Discover curated products with clear pricing, real stock, and smooth checkout.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/shop" className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-teal-900 transition hover:bg-teal-50">
            Shop now
          </Link>
          <Link to="/cart" className="inline-flex items-center rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
            View cart
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured products</h2>
          <Link to="/shop" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
            Browse all products
          </Link>
        </div>
        {productsLoading ? (
          <ProductSkeleton count={4} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <article key={product.id} className="surface-elevated overflow-hidden border-teal-100/70">
                <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{product.category}</p>
                  <h3 className="font-bold text-slate-900">{product.name}</h3>
                  <StarRating rating={4.6} reviews={98} />
                  <p className="text-base font-bold text-teal-800">
                    <Currency value={product.price} />
                  </p>
                  <Link to={`/products/${product.id}`} className="btn-muted w-full">
                    Quick view
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Shop by category</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.name} to={`/shop?category=${encodeURIComponent(category.name)}`} className="group surface-elevated overflow-hidden border-teal-100/70">
              <div className="relative h-36 overflow-hidden">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{category.name}</h3>
                <p className="text-sm text-slate-500">{category.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="surface-elevated space-y-4 border-teal-100/70 p-6">
        <h2 className="text-2xl font-bold text-slate-900">What customers say</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <StarRating rating={5} reviews={24} />
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">{item.name}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="surface-elevated border-teal-100/70 bg-gradient-to-r from-slate-900 to-teal-900 p-6 text-white">
        <h2 className="text-2xl font-bold">Get product drops and offers</h2>
        <p className="mt-1 text-sm text-slate-200">Subscribe to our newsletter for weekly updates.</p>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-300"
          />
          <button type="button" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 transition hover:bg-teal-50">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

