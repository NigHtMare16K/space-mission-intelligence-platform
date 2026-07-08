import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  colorClass?: string
  showLabel?: boolean
  label?: string
}

export function ProgressBar({
  value,
  max = 100,
  className,
  colorClass,
  showLabel = true,
  label,
}: ProgressBarProps) {
  const pct = Math.min(max, Math.max(0, value))
  const resolvedColor =
    colorClass ?? (pct >= 50 ? 'bg-green-500' : 'bg-red-500')

  return (
    <div className={className}>
      <div className="h-3 rounded-full bg-purple-500/20 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', resolvedColor)}
          initial={{ width: 0 }}
          animate={{ width: `${(pct / max) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="mt-2 text-sm text-slate-400 text-right">
          {label ?? `${pct.toFixed(1)}%`}
        </p>
      )}
    </div>
  )
}
