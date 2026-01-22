import { useQuery } from '@tanstack/react-query'
import { projectsApi, type ProjectsQueryParams } from '../api/projects'

export function useProjects(params?: ProjectsQueryParams) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.getProjects(params),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
  })
}
