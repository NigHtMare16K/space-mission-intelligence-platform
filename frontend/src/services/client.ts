import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 120000,
})

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.'
    if (error.response?.status === 404) return 'Data not found.'
    if (!error.response) return 'Unable to connect to the server. Is the backend running?'
    const detail = error.response.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return detail.map((d: { msg?: string }) => d.msg).join(', ')
    return `Server error (${error.response.status})`
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred.'
}
