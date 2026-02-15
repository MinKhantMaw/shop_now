export default function StockBadge({ stock }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
        Out of stock
      </span>
    )
  }

  if (stock <= 3) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
        Low stock ({stock})
      </span>
    )
  }

  return (
    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      In stock ({stock})
    </span>
  )
}
