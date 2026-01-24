import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api/notifications'
import type { NotificationFilters, NotificationCategory } from '@/lib/api/types'

/**
 * Hook to fetch notifications with optional filtering
 */
export const useNotifications = (filters?: NotificationFilters) => {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => notificationsApi.getNotifications(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to get unread notification count with polling
 * Polls every 30 seconds by default
 */
export const useUnreadCount = (pollInterval = 30000) => {
  return useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: () => notificationsApi.getUnreadCount(),
    staleTime: 15 * 1000, // 15 seconds
    refetchInterval: pollInterval,
    refetchIntervalInBackground: false,
  })
}

/**
 * Hook to mark a single notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      // Snapshot previous values
      const previousNotifications = queryClient.getQueriesData({
        queryKey: ['notifications'],
      })

      // Optimistically update notifications to mark as read
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (old: any) => {
          if (!old?.notifications) return old
          return {
            ...old,
            notifications: old.notifications.map((n: any) =>
              n.id === notificationId ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, (old.unreadCount || 0) - 1),
          }
        }
      )

      // Optimistically update unread count
      queryClient.setQueryData(
        ['notifications', 'unreadCount'],
        (old: any) => ({
          count: Math.max(0, (old?.count || 0) - 1),
        })
      )

      return { previousNotifications }
    },
    onError: (err, notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      // Snapshot previous values
      const previousNotifications = queryClient.getQueriesData({
        queryKey: ['notifications'],
      })

      // Optimistically update all notifications to mark as read
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (old: any) => {
          if (!old?.notifications) return old
          return {
            ...old,
            notifications: old.notifications.map((n: any) => ({
              ...n,
              isRead: true,
            })),
            unreadCount: 0,
          }
        }
      )

      // Optimistically update unread count
      queryClient.setQueryData(['notifications', 'unreadCount'], { count: 0 })

      return { previousNotifications }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Hook to delete a notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.deleteNotification(notificationId),
    onMutate: async (notificationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      // Snapshot previous values
      const previousNotifications = queryClient.getQueriesData({
        queryKey: ['notifications'],
      })

      // Optimistically remove the notification
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (old: any) => {
          if (!old?.notifications) return old
          const notification = old.notifications.find(
            (n: any) => n.id === notificationId
          )
          const wasUnread = notification && !notification.isRead
          return {
            ...old,
            notifications: old.notifications.filter(
              (n: any) => n.id !== notificationId
            ),
            total: Math.max(0, (old.total || 0) - 1),
            unreadCount: wasUnread
              ? Math.max(0, (old.unreadCount || 0) - 1)
              : old.unreadCount,
          }
        }
      )

      return { previousNotifications }
    },
    onError: (err, notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Helper to get notification category from type
 */
export const getNotificationCategory = (
  type: string
): NotificationCategory => {
  const qaTypes = ['NEW_QUESTION', 'NEW_ANSWER', 'ANSWER_ACCEPTED', 'VOTE_RECEIVED']
  const socialTypes = ['NEW_FOLLOWER', 'MENTION', 'MENTOR_ASSIGNED', 'MENTEE_ASSIGNED', 'MENTOR_MESSAGE']
  const systemTypes = ['LEVEL_UP', 'RANK_UP', 'XP_GAINED']

  if (qaTypes.includes(type)) return 'qa'
  if (socialTypes.includes(type)) return 'social'
  if (systemTypes.includes(type)) return 'system'
  return 'all'
}
