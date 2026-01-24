import { apiClient } from './client'
import type {
  NotificationsListResponse,
  NotificationFilters,
  UnreadCountResponse,
  Notification,
} from './types'

export const notificationsApi = {
  /**
   * Get notifications with optional filtering
   */
  getNotifications: async (
    filters?: NotificationFilters
  ): Promise<NotificationsListResponse> => {
    const params = new URLSearchParams()
    if (filters?.unreadOnly) params.append('unreadOnly', 'true')
    if (filters?.category && filters.category !== 'all') {
      params.append('category', filters.category)
    }
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString())

    const queryString = params.toString()
    const endpoint = `/api/notifications${queryString ? `?${queryString}` : ''}`
    return apiClient.get<NotificationsListResponse>(endpoint)
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return apiClient.get<UnreadCountResponse>('/api/notifications/unread-count')
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (notificationId: string): Promise<Notification> => {
    return apiClient.patch<Notification>(
      `/api/notifications/${notificationId}/read`
    )
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ count: number }> => {
    return apiClient.patch<{ count: number }>('/api/notifications/read-all')
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (
    notificationId: string
  ): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(
      `/api/notifications/${notificationId}`
    )
  },
}
