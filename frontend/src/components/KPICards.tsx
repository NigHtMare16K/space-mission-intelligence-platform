import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface KPICardProps {
  label: string
  value: string | number
  icon: LucideIcon
  index: number
  suffix?: string
}

export function KPICard({ label, value, icon: Icon, index, suffix }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Card className="glass-card-hover h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">{label}</p>
              <p className="text-2xl font-bold text-slate-100">
                {value}
                {suffix && <span className="text-lg text-slate-400">{suffix}</span>}
              </p>
            </div>
            <div className="rounded-lg bg-purple-500/20 p-2.5">
              <Icon className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
