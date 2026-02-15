import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import ToastAlerts from './ToastAlerts'
import { clearAuthToken, isAuthenticated } from '../auth/auth'

export default function Layout() {
  const navigate = useNavigate()
  const { cart } = useShop()
  const count = cart.reduce((total, item) => total + item.quantity, 0)
  const authed = isAuthenticated()

  function onLogout() {
    clearAuthToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-30 border-b border-teal-100/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-teal-900">
            ShopFlow
          </Link>
          <div className="order-3 w-full md:order-2 md:w-auto md:flex-1 md:px-6">
            <label className="relative block">
              <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">⌕</span>
              <input
                type="search"
                placeholder="Search products, brands..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm md:max-w-md"
              />
            </label>
          </div>
          <nav className="order-2 flex items-center gap-2 text-sm font-semibold md:order-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 transition ${isActive ? 'bg-teal-800 text-white shadow-sm' : 'text-slate-700 hover:bg-teal-50'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 transition ${isActive ? 'bg-teal-800 text-white shadow-sm' : 'text-slate-700 hover:bg-teal-50'}`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 transition ${isActive ? 'bg-teal-800 text-white shadow-sm' : 'text-slate-700 hover:bg-teal-50'}`
              }
            >
              Cart ({count})
            </NavLink>
            {authed ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 transition ${isActive ? 'bg-teal-800 text-white shadow-sm' : 'text-slate-700 hover:bg-teal-50'}`
                  }
                >
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-xl px-3 py-2 text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 transition ${isActive ? 'bg-teal-800 text-white shadow-sm' : 'text-slate-700 hover:bg-teal-50'}`
                }
              >
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-slate-200/80 bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">ShopFlow</h3>
            <p className="mt-2 text-sm text-slate-600">Minimal shopping experience with secure checkout and modern UX.</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Shop</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/shop" className="hover:text-teal-700">All products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-teal-700">Cart</Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-teal-700">Checkout</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>support@shopflow.com</li>
              <li>+1 (555) 010-2030</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Follow</p>
            <div className="mt-3 flex gap-2">
              {['X', 'IG', 'FB'].map((item) => (
                <button key={item} type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <ToastAlerts />
    </div>
  )
}
