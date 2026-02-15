import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="surface-elevated mx-auto max-w-lg space-y-4 border-teal-100/70 p-8 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-slate-600">The page you requested does not exist.</p>
      <Link to="/shop" className="btn-brand">
        Back to catalog
      </Link>
    </section>
  )
}
