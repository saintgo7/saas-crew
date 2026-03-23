import { apiClient } from './client'
import type { User } from './types'

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface RegisterInput {
  email: string
  password: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
}

export const authApi = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/register', data)
  },

  async loginWithEmail(data: LoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/login', data)
  },

  async getMe(): Promise<User> {
    return apiClient.get<User>('/api/auth/me')
  },
}
