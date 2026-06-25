import { Globe } from 'lucide-react'
import { CountryExplorer } from '@/components/CountryExplorer'
import { ErrorState } from '@/components/StateMessages'
import { Skeleton } from '@/components/ui/skeleton'
import { useCountries } from '@/hooks/useCountries'

export function CountryExplorerPage() {
  const { countries, loading, error, refetch } = useCountries()

  return (
    <div className="container mx-auto px-4 py-8 pb-16 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Country Explorer</h1>
        </div>
        <p className="text-slate-400">
          Deep-dive into mission statistics by country or region.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <CountryExplorer countries={countries} />
      )}
    </div>
  )
}
