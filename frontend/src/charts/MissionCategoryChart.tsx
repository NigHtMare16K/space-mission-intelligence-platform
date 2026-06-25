import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/StateMessages'
import { CHART_COLORS } from '@/types/dashboard'
import type { MissionCategory } from '@/types/dashboard'

interface MissionCategoryChartProps {
  data: MissionCategory | null
  title?: string
  loading?: boolean
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: { category: string } }>
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-purple-500/30 bg-[#0a0a1a]/95 px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-slate-200">{payload[0].payload.category}</p>
      <p className="text-sm text-purple-300">{payload[0].value} missions</p>
    </div>
  )
}

export function MissionCategoryChart({
  data,
  title = 'Mission Categories',
  loading,
}: MissionCategoryChartProps) {
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

  if (!data || data.category.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No category data" description="Mission category data is not available." />
        </CardContent>
      </Card>
    )
  }

  const chartData = data.category.map((category, i) => ({
    category,
    missions: data.missions[i],
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }))

  const height = Math.max(300, chartData.length * 36)

  return (
    <Card className="glass-card-hover">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.1)" horizontal={false} />
            <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="category"
              width={140}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }} />
            <Bar dataKey="missions" radius={[0, 6, 6, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
