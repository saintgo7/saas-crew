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

// Mentoring System Types
export type UserRank = 'JUNIOR' | 'SENIOR' | 'MASTER'
export type MentorshipStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'

export interface MentorInfo {
  id: string
  name: string
  profileImage?: string
  rank: UserRank
  level: number
  bio?: string
  expertise?: string[]
  sessionsCount: number
  averageRating: number
  totalRatings: number
}

export interface MenteeInfo {
  id: string
  name: string
  profileImage?: string
  rank: UserRank
  level: number
  sessionsCount: number
}

export interface Mentorship {
  id: string
  mentorId: string
  menteeId: string
  mentor: MentorInfo
  mentee: MenteeInfo
  status: MentorshipStatus
  sessionsCount: number
  rating?: number
  feedback?: string
  startedAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface MentorshipRequest {
  id: string
  mentorId: string
  menteeId: string
  mentor: MentorInfo
  mentee: MenteeInfo
  status: MentorshipStatus
  message?: string
  createdAt: string
}

export interface MentoringDashboard {
  myMentors: Mentorship[]
  myMentees: Mentorship[]
  pendingRequests: MentorshipRequest[]
  availableMentors: MentorInfo[]
}

export interface AvailableMentorsParams {
  expertise?: string
  page?: number
  pageSize?: number
}

export interface AvailableMentorsResponse {
  mentors: MentorInfo[]
  total: number
  page: number
  pageSize: number
}

export interface RequestMentorshipInput {
  mentorId: string
  message?: string
}

export interface RateMentorshipInput {
  mentorshipId: string
  rating: number
  feedback?: string
}

// XP System Types
export type XpActivityType =
  | 'POST_CREATED'
  | 'ANSWER_CREATED'
  | 'ANSWER_ACCEPTED'
  | 'VOTE_RECEIVED'
  | 'RESOURCE_SHARED'
  | 'COURSE_COMPLETED'
  | 'CHAPTER_COMPLETED'
  | 'DAILY_LOGIN'
  | 'STREAK_BONUS'
  | 'MENTOR_BONUS'

export interface XpActivity {
  id: string
  userId: string
  type: XpActivityType
  amount: number
  description: string
  metadata?: {
    postId?: string
    courseId?: string
    chapterId?: string
    mentorshipId?: string
    streakDays?: number
  }
  createdAt: string
}

export interface XpHistoryResponse {
  activities: XpActivity[]
  total: number
  page: number
  pageSize: number
}

export interface LeaderboardUser {
  id: string
  name: string
  profileImage?: string
  avatar?: string
  rank: UserRank
  level: number
  experiencePoints: number
  position: number
}

export interface LeaderboardResponse {
  users: LeaderboardUser[]
  total: number
  currentUserPosition?: number
  period: 'all_time' | 'this_month' | 'this_week'
}

export interface XpStats {
  totalXp: number
  level: number
  rank: UserRank
  currentLevelXp: number
  nextLevelXp: number
  progress: number
  todayXp: number
  weekXp: number
  monthXp: number
  position: number
}

// Notification System Types
export type NotificationType =
  | 'NEW_QUESTION'
  | 'NEW_ANSWER'
  | 'ANSWER_ACCEPTED'
  | 'NEW_FOLLOWER'
  | 'MENTION'
  | 'VOTE_RECEIVED'
  | 'LEVEL_UP'
  | 'RANK_UP'
  | 'XP_GAINED'
  | 'MENTOR_ASSIGNED'
  | 'MENTEE_ASSIGNED'
  | 'MENTOR_MESSAGE'

export type NotificationCategory = 'all' | 'qa' | 'social' | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  content: string
  link?: string
  isRead: boolean
  createdAt: string
  metadata?: {
    postId?: string
    commentId?: string
    userId?: string
    xpAmount?: number
    level?: number
    rank?: string
  }
}

export interface NotificationsListResponse {
  notifications: Notification[]
  total: number
  page: number
  pageSize: number
  unreadCount: number
}

export interface NotificationFilters {
  unreadOnly?: boolean
  category?: NotificationCategory
  page?: number
  pageSize?: number
}

export interface UnreadCountResponse {
  count: number
}
