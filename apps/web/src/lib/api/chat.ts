import { apiClient } from './client'

// Chat Channel Types
export interface ChatChannel {
  id: string
  name: string
  description?: string
  type: 'general' | 'level-restricted' | 'project' | 'direct'
  requiredLevel?: number
  icon?: string
  memberCount: number
  unreadCount: number
  lastMessage?: {
    content: string
    authorName: string
    createdAt: string
  }
  createdAt: string
  updatedAt: string
}

// Chat Message Types
export interface ChatMessage {
  id: string
  channelId: string
  authorId: string
  author: {
    id: string
    name: string
    profileImage?: string
    level: number
    role: 'student' | 'mentor' | 'admin'
  }
  content: string
  reactions: MessageReaction[]
  replyTo?: {
    id: string
    authorName: string
    content: string
  }
  isEdited: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface MessageReaction {
  emoji: string
  count: number
  userIds: string[]
  hasReacted: boolean
}

// Online User Types
export interface OnlineUser {
  id: string
  name: string
  profileImage?: string
  level: number
  role: 'student' | 'mentor' | 'admin'
  status: 'online' | 'away' | 'busy'
  lastActiveAt: string
}

// API Response Types
export interface ChannelsResponse {
  channels: ChatChannel[]
  total: number
}

export interface MessagesResponse {
  messages: ChatMessage[]
  total: number
  hasMore: boolean
  cursor?: string
}

export interface OnlineUsersResponse {
  users: OnlineUser[]
  total: number
}

// API Input Types
export interface SendMessageInput {
  content: string
  replyToId?: string
}

export interface UpdateMessageInput {
  content: string
}

export interface ReactionInput {
  emoji: string
}

// Create Channel Input
export interface CreateChannelInput {
  name: string
  description?: string
  type?: 'general' | 'level-restricted' | 'project'
  requiredLevel?: number
  memberIds?: string[]
}

// Chat API Client
export const chatApi = {
  // Channel APIs
  async getChannels(): Promise<ChannelsResponse> {
    return apiClient.get<ChannelsResponse>('/api/chat/channels')
  },

  async getChannel(channelId: string): Promise<ChatChannel> {
    return apiClient.get<ChatChannel>(`/api/chat/channels/${channelId}`)
  },

  async createChannel(input: CreateChannelInput): Promise<ChatChannel> {
    return apiClient.post<ChatChannel>('/api/chat/channels', input)
  },

  async joinChannel(channelId: string): Promise<void> {
    return apiClient.post<void>(`/api/chat/channels/${channelId}/join`)
  },

  async leaveChannel(channelId: string): Promise<void> {
    return apiClient.post<void>(`/api/chat/channels/${channelId}/leave`)
  },

  // Message APIs
  async getMessages(
    channelId: string,
    cursor?: string,
    limit = 50
  ): Promise<MessagesResponse> {
    const params = new URLSearchParams({ limit: String(limit) })
    if (cursor) params.append('cursor', cursor)
    return apiClient.get<MessagesResponse>(
      `/api/chat/channels/${channelId}/messages?${params}`
    )
  },

  async sendMessage(
    channelId: string,
    input: SendMessageInput
  ): Promise<ChatMessage> {
    return apiClient.post<ChatMessage>(
      `/api/chat/channels/${channelId}/messages`,
      input
    )
  },

  async updateMessage(
    channelId: string,
    messageId: string,
    input: UpdateMessageInput
  ): Promise<ChatMessage> {
    return apiClient.patch<ChatMessage>(
      `/api/chat/channels/${channelId}/messages/${messageId}`,
      input
    )
  },

  async deleteMessage(channelId: string, messageId: string): Promise<void> {
    return apiClient.delete<void>(
      `/api/chat/channels/${channelId}/messages/${messageId}`
    )
  },

  // Reaction APIs
  async addReaction(
    channelId: string,
    messageId: string,
    input: ReactionInput
  ): Promise<MessageReaction[]> {
    return apiClient.post<MessageReaction[]>(
      `/api/chat/channels/${channelId}/messages/${messageId}/reactions`,
      input
    )
  },

  async removeReaction(
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<MessageReaction[]> {
    return apiClient.delete<MessageReaction[]>(
      `/api/chat/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`
    )
  },

  // Online Users APIs
  async getOnlineUsers(channelId: string): Promise<OnlineUsersResponse> {
    return apiClient.get<OnlineUsersResponse>(
      `/api/chat/channels/${channelId}/users/online`
    )
  },

  // Typing indicator APIs
  async sendTypingIndicator(channelId: string): Promise<void> {
    return apiClient.post<void>(
      `/api/chat/channels/${channelId}/typing`
    )
  },

  // Read status APIs
  async markAsRead(channelId: string): Promise<void> {
    return apiClient.post<void>(
      `/api/chat/channels/${channelId}/read`
    )
  },
}
