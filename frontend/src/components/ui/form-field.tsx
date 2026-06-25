import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-sm font-medium text-slate-300">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-purple-500/30 bg-[#0a0a1a]/80 px-3 py-2 text-sm text-slate-200 outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30'

export function FormSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string | number
  onChange: (value: string) => void
  options: readonly string[] | ReadonlyArray<{ label: string; value: string | number }>
  placeholder?: string
}) {
  const normalized = options.map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o,
  )

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {normalized.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export function FormInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}: {
  type?: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className={inputClass}
    />
  )
}
