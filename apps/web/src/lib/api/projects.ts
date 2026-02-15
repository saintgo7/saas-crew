import type {
  ProjectsListResponse,
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectWithOwner,
} from './types'
import { apiClient } from './client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export interface ProjectsQueryParams {
  page?: number
  limit?: number
  search?: string
  visibility?: 'PUBLIC' | 'PRIVATE'
  tags?: string
}

export const projectsApi = {
  /**
   * Get all projects with optional filters
   */
  async getProjects(params?: ProjectsQueryParams): Promise<ProjectsListResponse> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.visibility) searchParams.set('visibility', params.visibility)
    if (params?.tags) searchParams.set('tags', params.tags)

    const query = searchParams.toString()
    const url = `${API_URL}/api/projects${query ? `?${query}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }

    return response.json()
  },

  /**
   * Get single project by ID
   */
  async getProject(id: string): Promise<ProjectWithOwner> {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch project')
    }

    return response.json()
  },

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectInput): Promise<Project> {
    return apiClient.post<Project>('/api/projects', data)
  },

  /**
   * Update an existing project
   */
  async updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
    return apiClient.patch<Project>(`/api/projects/${id}`, data)
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    return apiClient.delete(`/api/projects/${id}`)
  },

  // ============================================
  // Member Management
  // ============================================

  /**
   * Add a member to a project
   */
  async addMember(
    projectId: string,
    data: { userId: string; role?: string },
  ): Promise<any> {
    return apiClient.post(`/api/projects/${projectId}/members`, data)
  },

  /**
   * Remove a member from a project
   */
  async removeMember(projectId: string, userId: string): Promise<void> {
    return apiClient.delete(`/api/projects/${projectId}/members/${userId}`)
  },

  /**
   * Update member role
   */
  async updateMemberRole(
    projectId: string,
    userId: string,
    role: string,
  ): Promise<any> {
    return apiClient.patch(`/api/projects/${projectId}/members/${userId}/role`, {
      role,
    })
  },

  // ============================================
  // Invitation System
  // ============================================

  /**
   * Get project invitations
   */
  async getInvitations(projectId: string): Promise<any[]> {
    return apiClient.get(`/api/projects/${projectId}/invitations`)
  },

  /**
   * Create an invitation
   */
  async createInvitation(
    projectId: string,
    data: { email?: string; userId?: string; role?: string },
  ): Promise<any> {
    return apiClient.post(`/api/projects/${projectId}/invitations`, data)
  },

  /**
   * Cancel an invitation
   */
  async cancelInvitation(projectId: string, invitationId: string): Promise<void> {
    return apiClient.delete(`/api/projects/${projectId}/invitations/${invitationId}`)
  },

  /**
   * Get current user's pending invitations
   */
  async getMyInvitations(): Promise<any[]> {
    return apiClient.get('/api/users/me/invitations')
  },

  /**
   * Respond to an invitation
   */
  async respondToInvitation(invitationId: string, accept: boolean): Promise<any> {
    return apiClient.post(`/api/users/me/invitations/${invitationId}/respond`, {
      accept,
    })
  },

  // ============================================
  // Activity Log
  // ============================================

  /**
   * Get project activity log
   */
  async getActivityLog(projectId: string, limit = 50): Promise<any[]> {
    return apiClient.get(`/api/projects/${projectId}/activities?limit=${limit}`)
  },

  // ============================================
  // GitHub Integration
  // ============================================

  /**
   * Sync project with GitHub
   */
  async syncGitHub(projectId: string): Promise<any> {
    return apiClient.post(`/api/projects/${projectId}/sync-github`)
  },
}
