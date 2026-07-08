import { api } from './client'
import type { RecommendationError, RecommendationItem } from '@/types/mission'

export const recommendationApi = {
  recommend: (mission_name: string) =>
    api
      .post<RecommendationItem[] | RecommendationError>('/mission-recommend/recommend', {
        mission_name,
      })
      .then((r) => r.data),
}
