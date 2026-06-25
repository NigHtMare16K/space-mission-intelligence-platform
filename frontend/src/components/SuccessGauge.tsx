import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SuccessGaugeProps {
  percentage: number
}

export function SuccessGauge({ percentage }: SuccessGaugeProps) {
  const clamped = Math.min(100, Math.max(0, percentage))
  const color =
    clamped >= 80 ? '#22c55e' : clamped >= 60 ? '#a78bfa' : clamped >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <Card className="glass-card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Mission Success Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-6">
        <div className="relative w-48 h-24 overflow-hidden">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(124, 58, 237, 0.2)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (clamped / 100) * 251.2 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-3xl font-bold text-slate-100">{clamped.toFixed(1)}</span>
            <span className="text-lg text-slate-400">%</span>
          </motion.div>
        </div>
        <motion.div
          className="mt-2 h-1 w-16 rounded-full origin-left"
          style={{ background: color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: clamped / 100 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        <p className="mt-3 text-sm text-slate-400">Across completed missions</p>
      </CardContent>
    </Card>
  )
}

export function SuccessGaugeSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-5 w-32 bg-purple-500/10 rounded animate-pulse" />
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-6">
        <div className="w-48 h-24 bg-purple-500/10 rounded animate-pulse" />
      </CardContent>
    </Card>
  )
}
