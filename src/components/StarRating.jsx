export default function StarRating({ rating = 4.5, reviews = 0 }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)))

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < rounded ? 'opacity-100' : 'opacity-30'}>
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-slate-500">
        {rating.toFixed(1)} ({reviews})
      </span>
    </div>
  )
}

