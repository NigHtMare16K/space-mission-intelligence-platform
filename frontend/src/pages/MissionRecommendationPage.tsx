import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Sparkles, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState, EmptyState } from '@/components/StateMessages'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form-field'
import { recommendationApi, getErrorMessage } from '@/services/api'
import type { RecommendationItem } from '@/types/mission'

function isRecommendationError(
  data: RecommendationItem[] | { error: string },
): data is { error: string } {
  return !Array.isArray(data) && 'error' in data
}

export function MissionRecommendationPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<RecommendationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const runRecommend = async (name: string) => {
    setLoading(true)
    setError(null)
    setResults([])
    setSearched(true)

    try {
      const data = await recommendationApi.recommend(name)
      if (isRecommendationError(data)) {
        setError(data.error)
      } else {
        setResults(data)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    await runRecommend(trimmed)
  }

  const handleCardClick = (missionName: string) => {
    navigate(`/search?mission=${encodeURIComponent(missionName)}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-16 max-w-5xl">
      <PageHeader
        icon={Sparkles}
        title="Mission Recommendation"
        description="Enter a mission name to discover similar missions based on ML similarity scoring."
      />

      <Card className="glass-card-hover mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <FormInput
              value={query}
              onChange={setQuery}
              placeholder="Enter a mission name..."
            />
            <Button type="submit" disabled={loading || !query.trim()} className="shrink-0">
              {loading ? 'Finding...' : 'Get Recommendations'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && <LoadingState message="Finding similar missions..." />}

      {error && <ErrorState message={error} onRetry={() => runRecommend(query.trim())} />}

      {!loading && searched && !error && results.length === 0 && (
        <EmptyState title="No recommendations found" description="Try a different mission name from the dataset." />
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item, index) => (
            <motion.button
              key={item.mission_name}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCardClick(item.mission_name)}
              className="text-left glass-card glass-card-hover p-5 rounded-2xl cursor-pointer w-full"
            >
              <h3 className="text-lg font-semibold text-slate-100 mb-3">{item.mission_name}</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-slate-400 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Year
                  </div>
                  <p className="text-slate-200">{item.launch_year}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-slate-400 mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    Budget
                  </div>
                  <p className="text-slate-200">${item.budget}M</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-slate-400 mb-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Similarity
                  </div>
                  <p className="text-purple-300 font-medium">{(item.similarity * 100).toFixed(1)}%</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">Click to view full mission details →</p>
            </motion.button>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <EmptyState
          title="Enter a mission name"
          description="We'll recommend up to 5 similar missions. Click any result to open it in Mission Search."
        />
      )}
    </div>
  )
}
