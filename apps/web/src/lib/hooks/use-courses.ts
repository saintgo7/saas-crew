import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesApi } from '@/lib/api/courses'
import type { CourseLevel } from '@/lib/api/types'

/**
 * Hook to fetch all courses with optional filtering
 */
export const useCourses = (params?: {
  level?: CourseLevel
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  page?: number
  pageSize?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => coursesApi.getCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

/**
 * Hook to fetch a single course with chapters
 */
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesApi.getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch course progress
 */
export const useCourseProgress = (courseId: string, enabled = true) => {
  return useQuery({
    queryKey: ['courseProgress', courseId],
    queryFn: () => coursesApi.getCourseProgress(courseId),
    enabled: enabled && !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to enroll in a course
 */
export const useEnrollCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => coursesApi.enrollCourse(courseId),
    onSuccess: (_, courseId) => {
      // Invalidate course detail to update enrollment status
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
      // Invalidate courses list to update enrollment count
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      // Invalidate enrolled courses
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] })
    },
  })
}

/**
 * Hook to unenroll from a course
 */
export const useUnenrollCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => coursesApi.unenrollCourse(courseId),
    onSuccess: (_, courseId) => {
      // Invalidate course detail to update enrollment status
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      // Invalidate course progress
      queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId] })
      // Invalidate enrolled courses
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] })
    },
  })
}

/**
 * Hook to update chapter progress
 */
export const useUpdateChapterProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterId,
      completed,
      timeSpent,
    }: {
      chapterId: string
      completed: boolean
      timeSpent?: number
    }) => coursesApi.updateChapterProgress(chapterId, { completed, timeSpent }),
    onSuccess: (_, variables) => {
      // Invalidate course progress queries
      // We need to invalidate all course progress since we don't have courseId here
      queryClient.invalidateQueries({ queryKey: ['courseProgress'] })
    },
  })
}

/**
 * Hook to fetch enrolled courses
 */
export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: () => coursesApi.getEnrolledCourses(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
