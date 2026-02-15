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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-teal-900">
            ShopFlow
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 transition ${isActive ? 'bg-teal-800 text-white shadow-sm' : 'text-slate-700 hover:bg-teal-50'}`
              }
            >
              Catalog
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

      <ToastAlerts />
    </div>
  )
}
