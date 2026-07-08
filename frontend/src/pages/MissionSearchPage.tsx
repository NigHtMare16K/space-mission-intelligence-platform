import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, Search } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { MissionInfoCard } from '@/components/shared/MissionInfoCard'
import { MarkdownContent } from '@/components/shared/MarkdownContent'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState, EmptyState } from '@/components/StateMessages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form-field'
import { Skeleton } from '@/components/ui/skeleton'
import { searchApi, getErrorMessage } from '@/services/api'
import type { MissionSearchResponse } from '@/types/mission'

export function MissionSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('mission') ?? '')
  const [result, setResult] = useState<MissionSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastSearched = useRef('')

  const performSearch = useCallback(async (missionName: string, updateUrl = true) => {
    const trimmed = missionName.trim()
    if (!trimmed || trimmed === lastSearched.current) return

    lastSearched.current = trimmed
    setLoading(true)
    setError(null)
    setResult(null)
    setQuery(trimmed)

    try {
      const data = await searchApi.searchMission(trimmed)
      setResult(data)
      if (updateUrl) setSearchParams({ mission: trimmed })
    } catch (err) {
      lastSearched.current = ''
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [setSearchParams])

  useEffect(() => {
    const mission = searchParams.get('mission')
    if (mission) {
      performSearch(mission, false)
    }
  }, [searchParams, performSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    lastSearched.current = ''
    performSearch(query)
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-16 max-w-5xl">
      <PageHeader
        icon={Search}
        title="Mission Search"
        description="Search any mission by name to view details, AI-generated blog, and reference sources."
      />

      <Card className="glass-card-hover mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <FormInput
              value={query}
              onChange={setQuery}
              placeholder="e.g. Apollo 11, Mars Rover, Artemis I..."
            />
            <Button type="submit" disabled={loading || !query.trim()} className="shrink-0">
              {loading ? 'Searching...' : 'Search Mission'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && !result && (
        <div className="space-y-6">
          <LoadingState variant="skeleton" rows={2} />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={() => { lastSearched.current = ''; performSearch(query) }} />}

      {!loading && !result && !error && (
        <EmptyState
          title="Search for a mission"
          description="Enter a mission name above to explore its details and AI-generated analysis."
        />
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <MissionInfoCard mission={result.mission_data} highlight />

          <Card className="glass-card-hover">
            <CardHeader>
              <CardTitle>AI Mission Blog</CardTitle>
              <p className="text-sm text-slate-400">Generated analysis and historical context</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingState variant="skeleton" rows={6} />
              ) : (
                <MarkdownContent content={result.blog} />
              )}
            </CardContent>
          </Card>

          {result.reference_urls.length > 0 && (
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle>References</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.reference_urls.map((url, i) => (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-purple-300 hover:text-cyan-300 transition-colors break-all"
                      >
                        <ExternalLink className="h-4 w-4 shrink-0" />
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
