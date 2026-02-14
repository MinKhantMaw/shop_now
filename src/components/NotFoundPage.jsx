import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-slate-600">The page you requested does not exist.</p>
      <Link
        to="/"
        className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Back to catalog
      </Link>
    </section>
  )
}
