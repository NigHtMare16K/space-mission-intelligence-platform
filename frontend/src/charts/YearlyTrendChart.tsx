import { useState } from 'react'
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/StateMessages'
import type { YearlyTrend } from '@/types/dashboard'

interface YearlyTrendChartProps {
  data: YearlyTrend | null
  title?: string
  loading?: boolean
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-purple-500/30 bg-[#0a0a1a]/95 px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400">Year {label}</p>
      <p className="text-sm font-semibold text-purple-300">{payload[0].value} missions</p>
    </div>
  )
}

export function YearlyTrendChart({ data, title = 'Yearly Mission Trend', loading }: YearlyTrendChartProps) {
  const [brushStart, setBrushStart] = useState<number | undefined>(undefined)
  const [brushEnd, setBrushEnd] = useState<number | undefined>(undefined)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.year.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No trend data" description="Yearly mission data is not available." />
        </CardContent>
      </Card>
    )
  }

  const chartData = data.year.map((year, i) => ({
    year: year,
    missions: data.missions[i],
  }))

  return (
    <Card className="glass-card-hover">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-slate-400">Drag the brush below to zoom into a year range</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="missionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.1)" />
            <XAxis
              dataKey="year"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="missions"
              stroke="#a78bfa"
              strokeWidth={2}
              fill="url(#missionGradient)"
              dot={{ fill: '#7c3aed', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 6, fill: '#22d3ee', stroke: '#7c3aed', strokeWidth: 2 }}
            />
            <Brush
              dataKey="year"
              height={28}
              stroke="#7c3aed"
              fill="rgba(124, 58, 237, 0.1)"
              travellerWidth={8}
              startIndex={brushStart}
              endIndex={brushEnd}
              onChange={(range) => {
                if (range.startIndex !== undefined) setBrushStart(range.startIndex)
                if (range.endIndex !== undefined) setBrushEnd(range.endIndex)
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
