export default function QuantityControl({ value, min = 1, max = 99, onChange }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300">
      <button
        type="button"
        className="px-3 py-1 text-slate-700 hover:bg-slate-100"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-14 border-x border-slate-300 py-1 text-center text-sm"
      />
      <button
        type="button"
        className="px-3 py-1 text-slate-700 hover:bg-slate-100"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
