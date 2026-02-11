import { apiClient } from './client'

export interface Canvas {
  id: string
  name: string
  description?: string
  projectId?: string
  ownerId: string
  owner: { id: string; name: string; avatar?: string }
  data?: Record<string, unknown>
  thumbnail?: string
  isPublic: boolean
  members?: CanvasMember[]
  _count?: { members: number }
  createdAt: string
  updatedAt: string
}

export interface CanvasMember {
  id: string
  canvasId: string
  userId: string
  user: { id: string; name: string; avatar?: string }
  role: 'OWNER' | 'EDITOR' | 'VIEWER'
  createdAt: string
}

export interface CreateCanvasInput {
  name: string
  description?: string
  projectId?: string
  isPublic?: boolean
}

export interface UpdateCanvasInput {
  name?: string
  description?: string
  isPublic?: boolean
}

export interface SaveCanvasInput {
  data: Record<string, unknown>
  thumbnail?: string
}

export const canvasApi = {
  getCanvases: () =>
    apiClient.get<Canvas[]>('/canvas'),

  getCanvas: (id: string) =>
    apiClient.get<Canvas>(`/canvas/${id}`),

  createCanvas: (data: CreateCanvasInput) =>
    apiClient.post<Canvas>('/canvas', data),

  updateCanvas: (id: string, data: UpdateCanvasInput) =>
    apiClient.patch<Canvas>(`/canvas/${id}`, data),

  deleteCanvas: (id: string) =>
    apiClient.delete<{ deleted: boolean }>(`/canvas/${id}`),

  saveCanvasData: (id: string, data: SaveCanvasInput) =>
    apiClient.post<{ id: string; updatedAt: string }>(`/canvas/${id}/save`, data),

  getProjectCanvases: (projectId: string) =>
    apiClient.get<Canvas[]>(`/canvas/project/${projectId}`),
}
