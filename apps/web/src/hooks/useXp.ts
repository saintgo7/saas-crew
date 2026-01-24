'use client'

import { useState, useEffect, useCallback } from 'react'
import { xpApi, type LeaderboardPeriod } from '@/lib/api/xp'
import type {
  LeaderboardResponse,
  XpHistoryResponse,
  XpStats,
} from '@/lib/api/types'

// Leaderboard hook
export interface UseLeaderboardOptions {
  limit?: number
  period?: LeaderboardPeriod
  page?: number
}

export interface UseLeaderboardReturn {
  data: LeaderboardResponse | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  setPage: (page: number) => void
  setPeriod: (period: LeaderboardPeriod) => void
}

export function useLeaderboard(
  options: UseLeaderboardOptions = {}
): UseLeaderboardReturn {
  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(options.page || 1)
  const [period, setPeriod] = useState<LeaderboardPeriod>(
    options.period || 'all_time'
  )

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await xpApi.getLeaderboard({
        limit: options.limit,
        page,
        period,
      })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch leaderboard'))
    } finally {
      setIsLoading(false)
    }
  }, [options.limit, page, period])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return {
    data,
    isLoading,
    error,
    refetch: fetchLeaderboard,
    setPage,
    setPeriod,
  }
}

// XP History hook
export interface UseXpHistoryOptions {
  userId?: string
  page?: number
  pageSize?: number
}

export interface UseXpHistoryReturn {
  data: XpHistoryResponse | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  setPage: (page: number) => void
}

export function useXpHistory(
  options: UseXpHistoryOptions = {}
): UseXpHistoryReturn {
  const [data, setData] = useState<XpHistoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(options.page || 1)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await xpApi.getXpHistory({
        userId: options.userId,
        page,
        pageSize: options.pageSize,
      })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch XP history'))
    } finally {
      setIsLoading(false)
    }
  }, [options.userId, page, options.pageSize])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return {
    data,
    isLoading,
    error,
    refetch: fetchHistory,
    setPage,
  }
}

// XP Stats hook
export interface UseXpStatsReturn {
  data: XpStats | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useXpStats(userId?: string): UseXpStatsReturn {
  const [data, setData] = useState<XpStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = userId
        ? await xpApi.getUserXpStats(userId)
        : await xpApi.getXpStats()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch XP stats'))
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    data,
    isLoading,
    error,
    refetch: fetchStats,
  }
}
