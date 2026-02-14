export default function StockBadge({ stock }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">
        Out of stock
      </span>
    )
  }

  if (stock <= 3) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
        Low stock ({stock})
      </span>
    )
  }

  return (
    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
      In stock ({stock})
    </span>
  )
}
