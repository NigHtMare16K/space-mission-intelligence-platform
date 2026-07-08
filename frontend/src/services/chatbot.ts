import { api } from './client'
import type { ChatbotResponse } from '@/types/mission'

export const chatbotApi = {
  chat: (question: string) =>
    api.post<ChatbotResponse>('/chatbot/chat', { question }).then((r) => r.data),
}
