export default function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <article key={index} className="surface-card animate-pulse overflow-hidden border-slate-200">
          <div className="h-48 bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-1/3 rounded bg-slate-200" />
            <div className="h-10 rounded bg-slate-200" />
          </div>
        </article>
      ))}
    </div>
  )
}

