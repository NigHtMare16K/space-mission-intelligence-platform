import { useCallback, useEffect, useState } from 'react'
import { dashboardApi, getErrorMessage } from '@/services/api'

export function useCountries() {
  const [countries, setCountries] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCountries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dashboardApi.getCountries()
      setCountries(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCountries()
  }, [fetchCountries])

  return { countries, loading, error, refetch: fetchCountries }
}
