import { apiClient } from './client'

/**
 * Quiz types
 */
export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'MULTIPLE_SELECT'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'

export interface QuizQuestion {
  id: string
  type: QuestionType
  question: string
  options: string[]
  order: number
  points: number
  // Only available after attempt or admin
  correctAnswer?: string
  explanation?: string
}

export interface Quiz {
  id: string
  title: string
  description?: string
  chapterId: string
  passingScore: number
  timeLimit?: number
  maxAttempts: number
  shuffleQuestions: boolean
  isPublished: boolean
  questions: QuizQuestion[]
  chapter?: {
    id: string
    title: string
    courseId: string
  }
  createdAt: string
  updatedAt: string
}

export interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  answers: Record<string, string>
  score: number
  passed: boolean
  timeSpent?: number
  startedAt: string
  completedAt: string
}

export interface QuizSubmitResult {
  attemptId: string
  score: number
  passed: boolean
  correctCount: number
  totalQuestions: number
  passingScore: number
}

export interface QuizStats {
  totalAttempts: number
  passRate: number
  averageScore: number
  highestScore: number
  lowestScore: number
}

/**
 * Get quiz by ID
 */
export async function getQuiz(id: string): Promise<Quiz> {
  return apiClient.get(`/quizzes/${id}`)
}

/**
 * Get quiz with answers (admin only)
 */
export async function getQuizWithAnswers(id: string): Promise<Quiz> {
  return apiClient.get(`/quizzes/${id}/admin`)
}

/**
 * Get quizzes for a chapter
 */
export async function getChapterQuizzes(chapterId: string): Promise<Quiz[]> {
  return apiClient.get(`/quizzes/chapter/${chapterId}`)
}

/**
 * Create a new quiz
 */
export interface CreateQuizDto {
  title: string
  description?: string
  chapterId: string
  passingScore?: number
  timeLimit?: number
  maxAttempts?: number
  shuffleQuestions?: boolean
  questions?: CreateQuestionDto[]
}

export interface CreateQuestionDto {
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
  order?: number
  points?: number
}

export async function createQuiz(data: CreateQuizDto): Promise<Quiz> {
  return apiClient.post('/quizzes', data)
}

/**
 * Update a quiz
 */
export interface UpdateQuizDto {
  title?: string
  description?: string
  passingScore?: number
  timeLimit?: number
  maxAttempts?: number
  shuffleQuestions?: boolean
  isPublished?: boolean
}

export async function updateQuiz(
  id: string,
  data: UpdateQuizDto,
): Promise<Quiz> {
  return apiClient.patch(`/quizzes/${id}`, data)
}

/**
 * Delete a quiz
 */
export async function deleteQuiz(id: string): Promise<void> {
  return apiClient.delete(`/quizzes/${id}`)
}

/**
 * Add a question to a quiz
 */
export async function addQuestion(
  quizId: string,
  data: CreateQuestionDto,
): Promise<QuizQuestion> {
  return apiClient.post(`/quizzes/${quizId}/questions`, data)
}

/**
 * Update a question
 */
export async function updateQuestion(
  questionId: string,
  data: Partial<CreateQuestionDto>,
): Promise<QuizQuestion> {
  return apiClient.patch(`/quizzes/questions/${questionId}`, data)
}

/**
 * Delete a question
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  return apiClient.delete(`/quizzes/questions/${questionId}`)
}

/**
 * Submit a quiz attempt
 */
export interface SubmitQuizDto {
  answers: Record<string, string>
  timeSpent?: number
}

export async function submitQuiz(
  quizId: string,
  data: SubmitQuizDto,
): Promise<QuizSubmitResult> {
  return apiClient.post(`/quizzes/${quizId}/submit`, data)
}

/**
 * Get user's attempts for a quiz
 */
export async function getMyAttempts(quizId: string): Promise<QuizAttempt[]> {
  return apiClient.get(`/quizzes/${quizId}/attempts`)
}

/**
 * Get attempt details
 */
export async function getAttemptDetails(
  attemptId: string,
): Promise<QuizAttempt & { quiz: Quiz }> {
  return apiClient.get(`/quizzes/attempts/${attemptId}`)
}

/**
 * Get quiz statistics
 */
export async function getQuizStats(quizId: string): Promise<QuizStats> {
  return apiClient.get(`/quizzes/${quizId}/stats`)
}
