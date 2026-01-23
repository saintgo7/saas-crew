export interface User {
  id: string
  email: string
  name: string
  studentId?: string
  department?: string
  bio?: string
  grade?: number
  role: 'student' | 'mentor' | 'admin'
  rank?: 'JUNIOR' | 'SENIOR' | 'MASTER'
  level: number
  experiencePoints: number
  profileImage?: string
  avatar?: string
  avatarUrl?: string
  githubId?: string
  theme?: string
  language?: string
  socialLinks?: SocialLinks
  createdAt: string
  updatedAt?: string
}

export interface UpdateUserInput {
  name?: string
  bio?: string
  department?: string
  grade?: number
  theme?: string
  language?: string
  avatarUrl?: string
  socialLinks?: SocialLinks
}

export interface SocialLinks {
  github?: string
  twitter?: string
  linkedin?: string
  website?: string
}

export interface Project {
  id: string
  name: string
  slug: string
  description: string
  visibility: 'PUBLIC' | 'PRIVATE'
  status?: 'planning' | 'in_progress' | 'completed' | 'archived'
  progress?: number
  startDate?: string
  teamMembers?: any[]
  githubRepo?: string
  deployUrl?: string
  coverImage?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  _count?: {
    members: number
  }
}

export interface ProjectsListResponse {
  data: Project[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreateProjectInput {
  name: string
  description: string
  visibility: 'PUBLIC' | 'PRIVATE'
  tags?: string[]
  techStack?: string[]
  githubRepo?: string
  deployUrl?: string
  coverImage?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  visibility?: 'PUBLIC' | 'PRIVATE'
  tags?: string[]
  techStack?: string[]
  githubRepo?: string
  deployUrl?: string
  coverImage?: string
}

export interface ProjectWithOwner extends Project {
  ownerId: string
  owner?: {
    id: string
    name: string
    profileImage?: string
  }
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
export type CourseLevel = 'JUNIOR' | 'SENIOR' | 'MASTER'

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
  slug: string
  title: string
  description: string
  level: CourseLevel
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  coverImage?: string
  thumbnail?: string
  duration: number // hours
  chaptersCount?: number
  enrolledCount?: number
  instructorId?: string
  instructorName?: string
  instructorImage?: string
  tags: string[]
  category?: string
  topics?: string[] // Learning objectives
  prerequisites?: string[] // Required course IDs
  order?: number
  published?: boolean
  featured?: boolean
  _count?: {
    chapters: number
    enrollments: number
  }
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

// Community System Types
export interface PostAuthor {
  id: string
  name: string
  profileImage?: string
  level: number
}

export interface Comment {
  id: string
  postId: string
  parentId?: string
  authorId: string
  author: PostAuthor
  content: string
  votes: number
  hasVoted?: boolean
  voteType?: 'upvote' | 'downvote'
  isAccepted: boolean
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  author: PostAuthor
  tags: string[]
  votes: number
  hasVoted?: boolean
  voteType?: 'upvote' | 'downvote'
  views: number
  commentsCount: number
  hasAcceptedAnswer: boolean
  createdAt: string
  updatedAt: string
}

export interface PostWithComments extends Post {
  comments: Comment[]
}

export interface PostsListResponse {
  posts: Post[]
  total: number
  page: number
  pageSize: number
}

export type PostSortBy = 'latest' | 'popular' | 'views'

export interface PostFilters {
  tag?: string
  search?: string
  sortBy?: PostSortBy
  page?: number
  pageSize?: number
}

export interface CreatePostInput {
  title: string
  content: string
  tags: string[]
}

export interface CreateCommentInput {
  postId: string
  content: string
  parentId?: string
}

export interface UpdateCommentInput {
  content: string
}

export interface VoteInput {
  type: 'upvote' | 'downvote'
}

// Dashboard Activity Feed Types
export type ActivityType =
  | 'course_progress'
  | 'course_completed'
  | 'post_created'
  | 'comment_created'
  | 'project_joined'
  | 'achievement_earned'
  | 'level_up'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description?: string
  link?: string
  createdAt: string
  metadata?: {
    courseId?: string
    postId?: string
    projectId?: string
    achievementId?: string
    progress?: number
    level?: number
  }
}

// Dashboard Stats Types
export interface DashboardStats {
  totalCoursesEnrolled: number
  totalCoursesCompleted: number
  totalProjects: number
  totalContributions: number
  daysActive: number
  postsCreated?: number
  commentsCreated?: number
}

// Extended Dashboard Data
export interface ExtendedDashboardData extends DashboardData {
  activities: ActivityItem[]
  stats: DashboardStats
}
