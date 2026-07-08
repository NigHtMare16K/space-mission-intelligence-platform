export interface OverviewStats {
  total_missions: number
  missions_completed: number
  upcoming_missions: number
  ongoing_missions: number
  avg_cost: number
  total_countries: number
  launch_vehicles: number
  success_percentage: number
}

export interface YearlyTrend {
  year: string[]
  missions: number[]
}

export interface StatusDistribution {
  status: string[]
  count: number[]
}

export interface MissionCategory {
  category: string[]
  missions: number[]
}

export interface AgencyRecord {
  Agency: string
  total_missions: number
  successful_missions: number
  success_rate: number
}

export interface CountryOverview {
  total_missions: number
  upcoming_missions: number
  ongoing_missions: number
  success_rate: number
  top_vehicle: string
  top_agency: string
}

export interface CountryStats {
  overview: CountryOverview
  status_distribution: StatusDistribution
  mission_categories: MissionCategory
  yearly_trend: YearlyTrend
}

export const STATUS_COLORS: Record<string, string> = {
  Success: '#22c55e',
  Failed: '#ef4444',
  'Partial Success': '#f59e0b',
  Upcoming: '#3b82f6',
  Ongoing: '#a78bfa',
}

export const CHART_COLORS = [
  '#7c3aed',
  '#22d3ee',
  '#a78bfa',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#ec4899',
]

export interface PredictionRequest {
  Agency: string
  Agency_Type: number
  Program_Type: string
  Mission_Category: string
  Sub_Category: string
  Launch_Vehicle: string
  Launch_Site: string
  Crew_Type: string
  Destination: string
  Cost_USD_Million: number
  Launch_Year: number
  Country_Region: string
}

export interface PredictionResponse {
  prediction: 'Success' | 'Failure'
  success_probability: number
}
