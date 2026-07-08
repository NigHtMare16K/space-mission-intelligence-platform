import { api } from './client'
import type { MissionSearchResponse } from '@/types/mission'

export const searchApi = {
  searchMission: (mission_name: string) =>
    api
      .post<MissionSearchResponse>('/mission-search/search', { mission_name })
      .then((r) => r.data),
}
