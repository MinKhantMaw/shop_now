export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="surface-card flex items-center gap-3 border-teal-100/70 p-4 text-sm text-slate-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
      <span>{label}</span>
    </div>
  )
}
