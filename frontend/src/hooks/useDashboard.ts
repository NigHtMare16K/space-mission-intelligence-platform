import { useCallback, useEffect, useState } from 'react'
import { dashboardApi, getErrorMessage } from '@/services/api'
import type {
  AgencyRecord,
  MissionCategory,
  OverviewStats,
  StatusDistribution,
  YearlyTrend,
} from '@/types/dashboard'

interface DashboardState {
  overview: OverviewStats | null
  yearlyTrend: YearlyTrend | null
  statusDistribution: StatusDistribution | null
  missionCategory: MissionCategory | null
  agencies: AgencyRecord[] | null
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  overview: null,
  yearlyTrend: null,
  statusDistribution: null,
  missionCategory: null,
  agencies: null,
  loading: true,
  error: null,
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>(initialState)

  const fetchAll = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const [overview, yearlyTrend, statusDistribution, missionCategory, agencies] =
        await Promise.all([
          dashboardApi.getOverview(),
          dashboardApi.getYearlyTrend(),
          dashboardApi.getStatusDistribution(),
          dashboardApi.getMissionCategory(),
          dashboardApi.getAgencyAnalysis(),
        ])

      setState({
        overview,
        yearlyTrend,
        statusDistribution,
        missionCategory,
        agencies,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(err),
      }))
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return { ...state, refetch: fetchAll }
}
