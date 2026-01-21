import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard'
import { useUserStore } from '@/store/user-store'

export const useDashboard = () => {
  const { user, setUser } = useUserStore()

  // Fetch current user
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const userData = await dashboardApi.getCurrentUser()
      setUser(userData)
      return userData
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch user projects - only if user is available
  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useQuery({
    queryKey: ['projects', currentUser?.id],
    queryFn: () => dashboardApi.getUserProjects(currentUser!.id),
    enabled: !!currentUser?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Fetch course progress
  const {
    data: courseProgress,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useQuery({
    queryKey: ['courseProgress', currentUser?.id],
    queryFn: () => dashboardApi.getCourseProgress(currentUser!.id),
    enabled: !!currentUser?.id,
    staleTime: 2 * 60 * 1000,
  })

  // Fetch level progress
  const {
    data: levelProgress,
    isLoading: isLoadingLevel,
    error: levelError,
  } = useQuery({
    queryKey: ['levelProgress', currentUser?.id],
    queryFn: () => dashboardApi.getLevelProgress(currentUser!.id),
    enabled: !!currentUser?.id,
    staleTime: 2 * 60 * 1000,
  })

  return {
    user: currentUser || user,
    projects: projects || [],
    courseProgress: courseProgress || [],
    levelProgress,
    isLoading: isLoadingUser || isLoadingProjects || isLoadingCourses || isLoadingLevel,
    errors: {
      user: userError,
      projects: projectsError,
      courses: coursesError,
      level: levelError,
    },
  }
}
