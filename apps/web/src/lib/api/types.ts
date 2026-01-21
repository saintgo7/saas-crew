export interface User {
  id: string
  email: string
  name: string
  studentId?: string
  department?: string
  role: 'student' | 'mentor' | 'admin'
  level: number
  experiencePoints: number
  profileImage?: string
  createdAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  status: 'planning' | 'in_progress' | 'completed' | 'archived'
  startDate: string
  endDate?: string
  teamMembers: {
    userId: string
    name: string
    role: string
    profileImage?: string
  }[]
  progress: number
  tags: string[]
}

export interface CourseProgress {
  courseId: string
  courseTitle: string
  totalModules: number
  completedModules: number
  progress: number
  lastAccessedAt: string
}

export interface LevelProgress {
  currentLevel: number
  currentXP: number
  nextLevelXP: number
  progress: number
  achievements: {
    id: string
    title: string
    earnedAt: string
  }[]
}

export interface DashboardData {
  user: User
  projects: Project[]
  courseProgress: CourseProgress[]
  levelProgress: LevelProgress
}

// Course System Types
export type CourseLevel = 'junior' | 'senior' | 'master'

export interface Chapter {
  id: string
  courseId: string
  title: string
  description: string
  orderIndex: number
  duration: number // minutes
  content?: string
  videoUrl?: string
  resources?: {
    title: string
    url: string
    type: 'pdf' | 'link' | 'code'
  }[]
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  level: CourseLevel
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  coverImage?: string
  duration: number // total minutes
  chaptersCount: number
  enrolledCount: number
  instructorId: string
  instructorName: string
  instructorImage?: string
  tags: string[]
  prerequisites?: string[]
  learningObjectives: string[]
  createdAt: string
  updatedAt: string
}

export interface CourseWithChapters extends Course {
  chapters: Chapter[]
}

export interface ChapterProgress {
  chapterId: string
  completed: boolean
  completedAt?: string
  timeSpent: number // minutes
}

export interface CourseEnrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  lastAccessedAt?: string
  completedAt?: string
  progress: number // 0-100
  chaptersProgress: ChapterProgress[]
}

export interface CoursesListResponse {
  courses: Course[]
  total: number
  page: number
  pageSize: number
}

export interface CourseDetailResponse {
  course: CourseWithChapters
  enrollment?: CourseEnrollment
  isEnrolled: boolean
}
