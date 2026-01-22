import type { ProjectsListResponse, Project } from './types'

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
  async getProject(id: string): Promise<Project> {
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
}
