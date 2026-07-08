import {
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Rocket,
  Target,
  Trophy,
  Flag,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MissionData } from '@/types/mission'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  Success: 'text-green-400 bg-green-500/10 border-green-500/30',
  Failed: 'text-red-400 bg-red-500/10 border-red-500/30',
  'Partial Success': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Upcoming: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  Ongoing: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-lg border border-purple-500/15 bg-purple-500/5 p-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium text-slate-100">{value}</p>
    </div>
  )
}

interface MissionInfoCardProps {
  mission: MissionData
  className?: string
  highlight?: boolean
}

export function MissionInfoCard({ mission, className, highlight }: MissionInfoCardProps) {
  const statusClass = STATUS_COLORS[mission.Status] ?? 'text-slate-300 bg-slate-500/10 border-slate-500/30'

  return (
    <Card className={cn('glass-card-hover', highlight && 'border-cyan-500/40', className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="text-xl">{mission.mission_name}</CardTitle>
          <span className={cn('rounded-full border px-3 py-1 text-xs font-medium', statusClass)}>
            {mission.Status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <InfoItem icon={Building2} label="Agency" value={mission.Agency} />
          <InfoItem icon={Calendar} label="Launch Year" value={mission['Launch Year']} />
          <InfoItem icon={MapPin} label="Destination" value={mission.Destination} />
          <InfoItem icon={Rocket} label="Launch Vehicle" value={mission['Launch Vehicle']} />
          <InfoItem icon={Flag} label="Category" value={mission['Mission Category']} />
          <InfoItem
            icon={DollarSign}
            label="Budget"
            value={`$${mission.Budget?.toLocaleString() ?? 'N/A'}M`}
          />
        </div>

        {mission.Objective && (
          <div className="rounded-lg border border-purple-500/15 bg-purple-500/5 p-4">
            <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
              <Target className="h-4 w-4" />
              Objective
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{mission.Objective}</p>
          </div>
        )}

        {mission.Achievement && (
          <div className="rounded-lg border border-purple-500/15 bg-purple-500/5 p-4">
            <div className="flex items-center gap-2 text-sm text-cyan-300 mb-2">
              <Trophy className="h-4 w-4" />
              Achievement
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{mission.Achievement}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
