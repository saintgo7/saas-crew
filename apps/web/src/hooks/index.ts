// Socket.io hooks
export {
  useSocket,
  getGlobalSocket,
  initGlobalSocket,
  disconnectGlobalSocket,
} from './useSocket'

export type {
  SocketStatus,
  SocketEvents,
  ChatSocketMessage,
  TypingIndicator,
  UserJoinedEvent,
  UserLeftEvent,
  ReactionEvent,
  UseSocketOptions,
  UseSocketReturn,
} from './useSocket'

// Chat hooks
export { useChat, useChannels } from './useChat'

export type {
  UseChatOptions,
  UseChatReturn,
  TypingUser,
  UseChannelsOptions,
  UseChannelsReturn,
} from './useChat'

// Canvas collaboration hooks
export { useCanvasCollaboration } from './useCanvasCollaboration'
export type { CollaboratorInfo, ConnectionStatus, UseCanvasCollaborationOptions } from './useCanvasCollaboration'

// XP hooks
export { useLeaderboard, useXpHistory, useXpStats } from './useXp'

export type {
  UseLeaderboardOptions,
  UseLeaderboardReturn,
  UseXpHistoryOptions,
  UseXpHistoryReturn,
  UseXpStatsReturn,
} from './useXp'
