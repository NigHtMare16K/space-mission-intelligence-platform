import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/StateMessages'
import { STATUS_COLORS } from '@/types/dashboard'
import type { StatusDistribution } from '@/types/dashboard'

interface StatusDonutChartProps {
  data: StatusDistribution | null
  title?: string
  loading?: boolean
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>
}) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-purple-500/30 bg-[#0a0a1a]/95 px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-slate-200">{item.name}</p>
      <p className="text-sm text-purple-300">{item.value} missions</p>
    </div>
  )
}

export function StatusDonutChart({ data, title = 'Mission Status Distribution', loading }: StatusDonutChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-full mx-auto max-w-[280px]" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.status.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No status data" description="Status distribution is not available." />
        </CardContent>
      </Card>
    )
  }

  const chartData = data.status.map((status, i) => ({
    name: status,
    value: data.count[i],
    fill: STATUS_COLORS[status] ?? '#7c3aed',
  }))

  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="glass-card-hover">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-200 text-2xl font-bold"
              >
                {total}
              </text>
              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-400 text-xs"
              >
                Total
              </text>
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-3 w-full lg:w-auto min-w-[200px]">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-200">
                  {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
