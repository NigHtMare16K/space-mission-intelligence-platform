import type { LucideIcon } from 'lucide-react'

export function CountryStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: LucideIcon
}) {
  return (
    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="text-lg font-semibold text-slate-100 truncate">{value}</p>
    </div>
  )
}
