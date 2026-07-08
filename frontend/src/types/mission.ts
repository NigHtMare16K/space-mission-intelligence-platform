export interface MissionData {
  mission_name: string
  'Country Region'?: string
  'Launch Vehicle': string
  'Agency Type': string
  'Mission Category': string
  Status: string
  Duration?: string
  Agency: string
  'Launch Year': string
  Destination: string
  Budget: number
  Achievement: string
  Objective: string
}

export interface MissionSearchResponse {
  mission_data: MissionData
  blog: string
  reference_urls: string[]
}

export interface RecommendationItem {
  mission_name: string
  launch_year: string
  budget: number
  similarity: number
}

export interface RecommendationError {
  error: string
}

export interface ComparisonRequest {
  mission1: string
  mission2: string
}

export interface AIComparison {
  historical_impact: string
  scientific_value: string
  technological_innovation: string
  cost_efficiency: string
  mission_success: string
  overall_winner: string
  similarities: string[]
  differences: string[]
  summary: string
}

export interface ComparisonResponse {
  mission_data: {
    mission_1: MissionData
    mission_2: MissionData
  }
  ai_comparison: AIComparison
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sourceMissions?: string[]
}

export interface ChatbotResponse {
  answer: string
  source_missions: string[]
}
