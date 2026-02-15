import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { canvasApi, type CreateCanvasInput, type UpdateCanvasInput } from '../api/canvas'

export function useCanvases() {
  return useQuery({
    queryKey: ['canvases'],
    queryFn: () => canvasApi.getCanvases(),
    retry: 1,
  })
}

export function useCanvas(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['canvases', id],
    queryFn: () => canvasApi.getCanvas(id),
    enabled: (options?.enabled ?? true) && !!id,
  })
}

export function useProjectCanvases(projectId: string) {
  return useQuery({
    queryKey: ['canvases', 'project', projectId],
    queryFn: () => canvasApi.getProjectCanvases(projectId),
    enabled: !!projectId,
  })
}

export function useCreateCanvas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCanvasInput) => canvasApi.createCanvas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] })
    },
  })
}

export function useUpdateCanvas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCanvasInput }) =>
      canvasApi.updateCanvas(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] })
      queryClient.invalidateQueries({ queryKey: ['canvases', variables.id] })
    },
  })
}

export function useDeleteCanvas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => canvasApi.deleteCanvas(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] })
    },
  })
}
