import axios from 'axios'
import type {
  AgencyRecord,
  CountryMapRecord,
  CountryStats,
  MissionCategory,
  OverviewStats,
  PredictionRequest,
  PredictionResponse,
  StatusDistribution,
  YearlyTrend,
} from '@/types/dashboard'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 15000,
})

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

  getCountryMap: () =>
    api.get<CountryMapRecord[]>('/dashboard/country-map').then((r) => r.data),
}

export const predictionApi = {
  predictSuccess: (payload: PredictionRequest) =>
    api.post<PredictionResponse>('/prediction/success', payload).then((r) => r.data),
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.'
    if (error.response?.status === 404) return 'Data not found.'
    if (!error.response) return 'Unable to connect to the server. Is the backend running?'
    return error.response.data?.detail ?? `Server error (${error.response.status})`
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred.'
}
