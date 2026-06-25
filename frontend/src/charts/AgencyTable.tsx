import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/StateMessages'
import type { AgencyRecord } from '@/types/dashboard'

interface AgencyTableProps {
  data: AgencyRecord[] | null
  loading?: boolean
}

function SuccessBar({ rate }: { rate: number }) {
  const color =
    rate >= 80 ? 'bg-green-500' : rate >= 60 ? 'bg-purple-500' : rate >= 40 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="flex items-center gap-3 min-w-[140px]">
      <div className="flex-1 h-2 rounded-full bg-purple-500/20 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className="text-sm font-medium text-slate-300 w-12 text-right">
        {rate.toFixed(1)}%
      </span>
    </div>
  )
}

export function AgencyTable({ data, loading }: AgencyTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Agencies</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No agency data"
            description="Agency analysis data is not available."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card-hover">
      <CardHeader>
        <CardTitle>Top Agencies</CardTitle>
        <p className="text-sm text-slate-400">Agencies with 20+ completed missions</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Agency</TableHead>
              <TableHead>Total Missions</TableHead>
              <TableHead className="w-[35%]">Success Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((agency, index) => (
              <TableRow key={agency.Agency}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-400 font-mono w-5">
                      {index + 1}
                    </span>
                    {agency.Agency}
                  </div>
                </TableCell>
                <TableCell>{agency.total_missions}</TableCell>
                <TableCell>
                  <SuccessBar rate={agency.success_rate} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
