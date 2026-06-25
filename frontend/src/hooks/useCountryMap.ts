import { useCallback, useEffect, useState } from 'react'
import { dashboardApi, getErrorMessage } from '@/services/api'
import type { CountryMapRecord } from '@/types/dashboard'

export function useCountryMap() {
  const [data, setData] = useState<CountryMapRecord[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMap = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await dashboardApi.getCountryMap()
      setData(result)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMap()
  }, [fetchMap])

  return { data, loading, error, refetch: fetchMap }
}
