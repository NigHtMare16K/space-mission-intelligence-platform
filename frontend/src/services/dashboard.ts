import { api } from './client'
import type {
  AgencyRecord,
  CountryStats,
  MissionCategory,
  OverviewStats,
  StatusDistribution,
  YearlyTrend,
} from '@/types/dashboard'

export const dashboardApi = {
  getOverview: () =>
    api.get<OverviewStats>('/dashboard/overview').then((r) => r.data),

  getYearlyTrend: () =>
    api.get<YearlyTrend>('/dashboard/yearly-trend').then((r) => r.data),

  getStatusDistribution: () =>
    api.get<StatusDistribution>('/dashboard/status-distribution').then((r) => r.data),

  getMissionCategory: () =>
    api.get<MissionCategory>('/dashboard/mission-category').then((r) => r.data),

  getAgencyAnalysis: () =>
    api.get<AgencyRecord[]>('/dashboard/agency-analysis').then((r) => r.data),

  getCountries: () =>
    api.get<string[]>('/dashboard/countries').then((r) => r.data),

  getCountryStats: (country: string) =>
    api.get<CountryStats>(`/dashboard/country/${encodeURIComponent(country)}`).then((r) => r.data),
}
