import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/StateMessages'
import type { CountryMapRecord } from '@/types/dashboard'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const REGION_TO_GEO_NAMES: Record<string, string[]> = {
  USA: ['United States of America'],
  Russia: ['Russia'],
  China: ['China'],
  Canada: ['Canada'],
  France: ['France'],
  Germany: ['Germany'],
  India: ['India'],
  Italy: ['Italy'],
  Japan: ['Japan'],
  Europe: [
    'France', 'Germany', 'Italy', 'Spain', 'United Kingdom', 'Netherlands',
    'Belgium', 'Poland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Austria',
    'Switzerland', 'Portugal', 'Greece', 'Czechia', 'Hungary', 'Romania',
    'Bulgaria', 'Ireland', 'Croatia', 'Slovakia', 'Lithuania', 'Latvia',
    'Estonia', 'Luxembourg', 'Malta', 'Cyprus', 'Slovenia',
  ],
}

function geoNameToRegion(geoName: string, data: CountryMapRecord[]): string | null {
  const direct = data.find((d) => d.Country_Region === geoName)
  if (direct) return direct.Country_Region

  for (const [region, geoNames] of Object.entries(REGION_TO_GEO_NAMES)) {
    if (geoNames.includes(geoName)) {
      const record = data.find((d) => d.Country_Region === region)
      if (record) return region
    }
  }
  return null
}

function getMissionsForGeo(geoName: string, data: CountryMapRecord[]): number {
  const direct = data.find((d) => d.Country_Region === geoName)
  if (direct) return direct.missions

  for (const [region, geoNames] of Object.entries(REGION_TO_GEO_NAMES)) {
    if (geoNames.includes(geoName)) {
      const record = data.find((d) => d.Country_Region === region)
      if (record) return record.missions
    }
  }
  return 0
}

function getRecordForGeo(geoName: string, data: CountryMapRecord[]): CountryMapRecord | null {
  const region = geoNameToRegion(geoName, data)
  if (!region) return null
  return data.find((d) => d.Country_Region === region) ?? null
}

function missionColor(missions: number, max: number): string {
  if (missions === 0) return '#12122a'
  const t = missions / max
  const r = Math.round(30 + t * (124 - 30))
  const g = Math.round(20 + t * (58 - 20))
  const b = Math.round(60 + t * (237 - 60))
  return `rgb(${r}, ${g}, ${b})`
}

interface WorldMapChartProps {
  data: CountryMapRecord[] | null
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function WorldMapChart({ data, loading, error, onRetry }: WorldMapChartProps) {
  const navigate = useNavigate()
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  const maxMissions = useMemo(
    () => (data ? Math.max(...data.map((d) => d.missions), 1) : 1),
    [data],
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />
  }

  if (!data?.length) return null

  return (
    <Card className="glass-card-hover">
      <CardHeader>
        <CardTitle>Global Mission Distribution</CardTitle>
        <p className="text-sm text-slate-400">
          Choropleth by total missions — click a country to explore details
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-xl border border-purple-500/20 bg-[#0a0a1a]/50 overflow-hidden">
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 140 }}
            width={800}
            height={400}
            style={{ width: '100%', height: 'auto' }}
          >
            <ZoomableGroup center={[10, 10]} zoom={1}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const geoName = geo.properties.name as string
                    const missions = getMissionsForGeo(geoName, data)
                    const region = geoNameToRegion(geoName, data)
                    const fill = missionColor(missions, maxMissions)

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="#1e1b4b"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            fill: region ? '#a78bfa' : fill,
                            outline: 'none',
                            cursor: region ? 'pointer' : 'default',
                          },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={(evt) => {
                          const record = getRecordForGeo(geoName, data)
                          if (record) {
                            setTooltip({
                              x: evt.clientX,
                              y: evt.clientY,
                              text: `${record.Country_Region}: ${record.missions} missions (${record.success_rate}% success)`,
                            })
                          }
                        }}
                        onMouseMove={(evt) => {
                          if (tooltip) {
                            setTooltip((t) => t ? { ...t, x: evt.clientX, y: evt.clientY } : null)
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => {
                          const target = geoNameToRegion(geoName, data)
                          if (target) {
                            navigate(`/country?country=${encodeURIComponent(target)}`)
                          }
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none rounded-lg border border-purple-500/30 bg-[#0a0a1a]/95 px-3 py-2 text-sm text-slate-200 shadow-xl"
              style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
            >
              {tooltip.text}
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-slate-400">
            <span>Low</span>
            <div className="flex h-3 w-24 rounded-full overflow-hidden">
              {[0.2, 0.4, 0.6, 0.8, 1].map((t) => (
                <div
                  key={t}
                  className="flex-1"
                  style={{ background: missionColor(t * maxMissions, maxMissions) }}
                />
              ))}
            </div>
            <span>High missions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
