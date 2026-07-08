import { api } from './client'
import type { ComparisonRequest, ComparisonResponse } from '@/types/mission'

export const comparisonApi = {
  compareMissions: (payload: ComparisonRequest) =>
    api.post<ComparisonResponse>('/mission-comparison/compare', payload).then((r) => r.data),
}
