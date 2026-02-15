import { apiClient } from './client'
import type {
  LeaderboardResponse,
  XpHistoryResponse,
  XpStats,
} from './types'

export type LeaderboardPeriod = 'all_time' | 'this_month' | 'this_week'

export interface LeaderboardParams {
  limit?: number
  page?: number
  period?: LeaderboardPeriod
}

export interface XpHistoryParams {
  userId?: string
  page?: number
  pageSize?: number
}

export const xpApi = {
  /**
   * Get XP leaderboard
   */
  async getLeaderboard(params?: LeaderboardParams): Promise<LeaderboardResponse> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.period) queryParams.set('period', params.period)

    const queryString = queryParams.toString()
    const endpoint = `/api/xp/leaderboard${queryString ? `?${queryString}` : ''}`

    return apiClient.get<LeaderboardResponse>(endpoint)
  },

  /**
   * Get XP activity history
   */
  async getXpHistory(params?: XpHistoryParams): Promise<XpHistoryResponse> {
    const queryParams = new URLSearchParams()
    if (params?.userId) queryParams.set('userId', params.userId)
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString())

    const queryString = queryParams.toString()
    const endpoint = `/api/xp/history${queryString ? `?${queryString}` : ''}`

    return apiClient.get<XpHistoryResponse>(endpoint)
  },

  /**
   * Get current user's XP stats
   */
  async getXpStats(): Promise<XpStats> {
    return apiClient.get<XpStats>('/api/xp/stats')
  },

  /**
   * Get XP stats for a specific user
   */
  async getUserXpStats(userId: string): Promise<XpStats> {
    return apiClient.get<XpStats>(`/api/xp/stats/${userId}`)
  },
}
