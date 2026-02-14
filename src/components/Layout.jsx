import { Link, NavLink, Outlet } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import ToastAlerts from './ToastAlerts'

export default function Layout() {
  const { cart } = useShop()
  const count = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
            ShopFlow
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }
            >
              Catalog
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }
            >
              Cart ({count})
            </NavLink>
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
