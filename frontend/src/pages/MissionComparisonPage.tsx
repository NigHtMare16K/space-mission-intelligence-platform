import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, Trophy } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { MissionInfoCard } from '@/components/shared/MissionInfoCard'
import { MarkdownContent } from '@/components/shared/MarkdownContent'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState, EmptyState } from '@/components/StateMessages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormField, FormInput } from '@/components/ui/form-field'
import { comparisonApi, getErrorMessage } from '@/services/api'
import type { ComparisonResponse } from '@/types/mission'
import { cn } from '@/lib/utils'

const COMPARISON_CRITERIA = [
  { key: 'historical_impact', label: 'Historical Impact' },
  { key: 'scientific_value', label: 'Scientific Value' },
  { key: 'technological_innovation', label: 'Technological Innovation' },
  { key: 'cost_efficiency', label: 'Cost Efficiency' },
  { key: 'mission_success', label: 'Mission Success' },
] as const

function WinnerBadge({ winner, name }: { winner: string; name: string }) {
  const isWinner = winner.toLowerCase().includes(name.toLowerCase().split(' ')[0])
  if (!isWinner) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-xs text-amber-300">
      <Trophy className="h-3 w-3" />
      Winner
    </span>
  )
}

export function MissionComparisonPage() {
  const [mission1, setMission1] = useState('')
  const [mission2, setMission2] = useState('')
  const [result, setResult] = useState<ComparisonResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mission1.trim() || !mission2.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await comparisonApi.compareMissions({
        mission1: mission1.trim(),
        mission2: mission2.trim(),
      })
      setResult(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const winner = result?.ai_comparison.overall_winner ?? ''

  return (
    <div className="container mx-auto px-4 py-8 pb-16 max-w-6xl">
      <PageHeader
        icon={GitCompare}
        title="Mission Comparison"
        description="Compare two missions side-by-side with AI-powered analysis and winner highlights."
      />

      <Card className="glass-card-hover mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleCompare} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <FormField label="Mission 1">
              <FormInput value={mission1} onChange={setMission1} placeholder="First mission name" />
            </FormField>
            <FormField label="Mission 2">
              <FormInput value={mission2} onChange={setMission2} placeholder="Second mission name" />
            </FormField>
            <Button type="submit" disabled={loading || !mission1.trim() || !mission2.trim()}>
              {loading ? 'Comparing...' : 'Compare'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && <LoadingState message="Generating AI comparison..." />}

      {error && <ErrorState message={error} onRetry={() => handleCompare({ preventDefault: () => {} } as React.FormEvent)} />}

      {!loading && !result && !error && (
        <EmptyState
          title="Select two missions"
          description="Enter exact mission names from the dataset to compare them."
        />
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <MissionInfoCard
                mission={result.mission_data.mission_1}
                highlight={winner.toLowerCase().includes(result.mission_data.mission_1.mission_name.toLowerCase().split(' ')[0])}
              />
              <div className="absolute top-4 right-4">
                <WinnerBadge winner={winner} name={result.mission_data.mission_1.mission_name} />
              </div>
            </div>
            <div className="relative">
              <MissionInfoCard
                mission={result.mission_data.mission_2}
                highlight={winner.toLowerCase().includes(result.mission_data.mission_2.mission_name.toLowerCase().split(' ')[0])}
              />
              <div className="absolute top-4 right-4">
                <WinnerBadge winner={winner} name={result.mission_data.mission_2.mission_name} />
              </div>
            </div>
          </div>

          <Card className="glass-card-hover border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                Overall Winner: {result.ai_comparison.overall_winner}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownContent content={result.ai_comparison.summary} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPARISON_CRITERIA.map(({ key, label }) => (
              <Card key={key} className="glass-card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {result.ai_comparison[key]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-base text-green-400">Similarities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.ai_comparison.similarities.map((s, i) => (
                    <li key={i} className={cn('text-sm text-slate-300 pl-3 border-l-2 border-green-500/40')}>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-base text-cyan-400">Differences</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.ai_comparison.differences.map((d, i) => (
                    <li key={i} className={cn('text-sm text-slate-300 pl-3 border-l-2 border-cyan-500/40')}>
                      {d}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  )
}
