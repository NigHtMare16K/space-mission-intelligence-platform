import { useCallback, useState } from 'react'
import { dashboardApi, getErrorMessage } from '@/services/api'
import type { CountryStats } from '@/types/dashboard'

export function useCountryStats() {
  const [data, setData] = useState<CountryStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCountry = useCallback(async (country: string) => {
    if (!country) return
    setLoading(true)
    setError(null)
    try {
      const result = await dashboardApi.getCountryStats(country)
      setData(result)
    } catch (err) {
      setData(null)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { data, loading, error, fetchCountry, clear }
}
