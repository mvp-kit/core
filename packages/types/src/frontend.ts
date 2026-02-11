export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UserSummary {
  id: string
  name: string
  email: string
}
