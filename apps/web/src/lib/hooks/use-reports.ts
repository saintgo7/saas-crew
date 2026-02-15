import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportsApi } from '@/lib/api/reports'
import type { ReportSections } from '@/lib/api/reports'

export const useReports = (params?: {
  status?: 'DRAFT' | 'PUBLISHED'
  search?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => reportsApi.getReports(params),
    staleTime: 2 * 60 * 1000,
  })
}

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => reportsApi.getReport(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export const useCreateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      title: string
      periodStart: string
      periodEnd: string
      summary?: string
      sections: ReportSections
      status?: string
    }) => reportsApi.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export const useUpdateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: {
        title?: string
        periodStart?: string
        periodEnd?: string
        summary?: string
        sections?: ReportSections
        status?: string
      }
    }) => reportsApi.updateReport(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['report', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export const useDeleteReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reportsApi.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export const useLearningStats = (
  periodStart: string,
  periodEnd: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ['learningStats', periodStart, periodEnd],
    queryFn: () => reportsApi.getLearningStats(periodStart, periodEnd),
    enabled: enabled && !!periodStart && !!periodEnd,
    staleTime: 5 * 60 * 1000,
  })
}
