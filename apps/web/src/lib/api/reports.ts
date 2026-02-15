import { apiClient } from './client'

export interface ReportSections {
  learningSummary: string
  achievements: string
  courseDetails: string
  issues: string
  nextPlans: string
}

export interface Report {
  id: string
  title: string
  periodStart: string
  periodEnd: string
  status: 'DRAFT' | 'PUBLISHED'
  sections: ReportSections
  summary: string | null
  authorId: string
  author: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  createdAt: string
  updatedAt: string
}

export interface ReportsListResponse {
  reports: Report[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface LearningStats {
  period: { start: string; end: string }
  totalEnrollments: number
  completedEnrollments: number
  completionRate: number
  courses: {
    id: string
    title: string
    totalChapters: number
    totalEnrollments: number
    periodEnrollments: number
    periodCompleted: number
    avgProgress: number
  }[]
}

export const reportsApi = {
  async getReports(params?: {
    status?: 'DRAFT' | 'PUBLISHED'
    search?: string
    page?: number
    limit?: number
  }): Promise<ReportsListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    return apiClient.get<ReportsListResponse>(
      `/api/reports${query ? `?${query}` : ''}`
    )
  },

  async getReport(id: string): Promise<Report> {
    return apiClient.get<Report>(`/api/reports/${id}`)
  },

  async createReport(data: {
    title: string
    periodStart: string
    periodEnd: string
    summary?: string
    sections: ReportSections
    status?: string
  }): Promise<Report> {
    return apiClient.post<Report>('/api/reports', data)
  },

  async updateReport(
    id: string,
    data: {
      title?: string
      periodStart?: string
      periodEnd?: string
      summary?: string
      sections?: ReportSections
      status?: string
    }
  ): Promise<Report> {
    return apiClient.patch<Report>(`/api/reports/${id}`, data)
  },

  async deleteReport(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/reports/${id}`)
  },

  async getLearningStats(
    periodStart: string,
    periodEnd: string
  ): Promise<LearningStats> {
    const params = new URLSearchParams({
      periodStart,
      periodEnd,
    })
    return apiClient.get<LearningStats>(
      `/api/reports/stats/learning?${params.toString()}`
    )
  },
}
