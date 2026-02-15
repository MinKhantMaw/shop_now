import { useShop } from '../context/ShopContext'

const tone = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  info: 'border-teal-200 bg-teal-50 text-teal-900',
}

export default function ToastAlerts() {
  const { toasts } = useShop()

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${tone[toast.type] || tone.info}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
