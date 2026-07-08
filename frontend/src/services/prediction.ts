import { api } from './client'
import type { PredictionRequest, PredictionResponse } from '@/types/dashboard'

export const predictionApi = {
  predictSuccess: (payload: PredictionRequest) =>
    api.post<PredictionResponse>('/prediction/success', payload).then((r) => r.data),
}
