import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronsUpDown, Globe, Rocket, Building2, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState, EmptyState } from '@/components/StateMessages'
import { CountryStatCard } from '@/components/CountryStatCard'
import { YearlyTrendChart } from '@/charts/YearlyTrendChart'
import { StatusDonutChart } from '@/charts/StatusDonutChart'
import { MissionCategoryChart } from '@/charts/MissionCategoryChart'
import { SuccessGauge } from '@/components/SuccessGauge'
import { useCountryStats } from '@/hooks/useCountryStats'
import { cn } from '@/lib/utils'

interface CountryExplorerProps {
  countries: string[]
}

export function CountryExplorer({ countries }: CountryExplorerProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(searchParams.get('country') ?? '')
  const { data, loading, error, fetchCountry } = useCountryStats()

  const handleSelect = (country: string) => {
    setSelected(country)
    setOpen(false)
    setSearchParams({ country })
    fetchCountry(country)
  }

  useEffect(() => {
    const fromUrl = searchParams.get('country')
    if (fromUrl) {
      setSelected(fromUrl)
      fetchCountry(fromUrl)
    }
  }, [searchParams, fetchCountry])

  return (
    <div>
      <Card className="glass-card-hover mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Select a country</span>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full sm:w-[280px] justify-between border-purple-500/30"
                >
                  {selected || 'Search countries...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem key={country} value={country} onSelect={() => handleSelect(country)}>
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selected === country ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {country}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {!selected && (
        <EmptyState
          title="No country selected"
          description="Choose a country from the dropdown to view statistics and charts."
        />
      )}

      {error && selected && <ErrorState message={error} onRetry={() => fetchCountry(selected)} />}

      <AnimatePresence mode="wait">
        {loading && selected && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-[300px] w-full rounded-2xl" />
          </motion.div>
        )}

        {data && !loading && selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <CountryStatCard label="Total Missions" value={data.overview.total_missions} icon={Rocket} />
              <CountryStatCard
                label="Success Rate"
                value={`${data.overview.success_rate}%`}
                icon={TrendingUp}
              />
              <CountryStatCard label="Top Agency" value={data.overview.top_agency} icon={Building2} />
              <CountryStatCard label="Top Launch Vehicle" value={data.overview.top_vehicle} icon={Rocket} />
              <CountryStatCard label="Ongoing" value={data.overview.ongoing_missions} icon={Calendar} />
              <CountryStatCard label="Upcoming" value={data.overview.upcoming_missions} icon={Calendar} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SuccessGauge percentage={data.overview.success_rate} />
              <div className="lg:col-span-2">
                <YearlyTrendChart data={data.yearly_trend} title={`${selected} — Yearly Trend`} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusDonutChart data={data.status_distribution} title={`${selected} — Status Distribution`} />
              <MissionCategoryChart data={data.mission_categories} title={`${selected} — Mission Categories`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
