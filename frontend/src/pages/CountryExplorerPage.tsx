import { BarChart3 } from 'lucide-react'
import { CountryExplorer } from '@/components/CountryExplorer'
import { PageHeader } from '@/components/layout/PageHeader'
import { ErrorState } from '@/components/StateMessages'
import { LoadingState } from '@/components/shared/LoadingState'
import { useCountries } from '@/hooks/useCountries'

export function CountryExplorerPage() {
  const { countries, loading, error, refetch } = useCountries()

  return (
    <div className="container mx-auto px-4 py-8 pb-16 max-w-7xl">
      <PageHeader
        icon={BarChart3}
        title="Country Statistics"
        description="Explore mission statistics, charts, and regional insights by country or region."
      />

      {loading ? (
        <LoadingState variant="skeleton" rows={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <CountryExplorer countries={countries} />
      )}
    </div>
  )
}
