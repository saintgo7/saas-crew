import { apiClient } from './client'
import type {
  Question,
  QuestionWithAnswers,
  QuestionsListResponse,
  QuestionFilters,
  CreateQuestionInput,
  CreateAnswerInput,
  Answer,
} from './qna-types'
import type { VoteInput } from './types'

/**
 * Q&A API client for questions and answers
 */
export const qnaApi = {
  /**
   * Get all questions with optional filtering
   */
  async getQuestions(filters?: QuestionFilters): Promise<QuestionsListResponse> {
    const params = new URLSearchParams()

    if (filters?.tag) params.set('tags', filters.tag)
    if (filters?.search) params.set('search', filters.search)
    // Backend expects uppercase status values (OPEN, ANSWERED, CLOSED, ALL)
    if (filters?.status && filters.status !== 'all') {
      params.set('status', filters.status.toUpperCase())
    }
    if (filters?.sortBy) params.set('sortBy', filters.sortBy)
    if (filters?.page) params.set('page', filters.page.toString())
    if (filters?.pageSize) params.set('limit', filters.pageSize.toString())
    if (filters?.hasBounty !== undefined) params.set('hasBounty', filters.hasBounty.toString())

    const query = params.toString()
    const endpoint = query ? `/api/qna/questions?${query}` : '/api/qna/questions'

    return apiClient.get<QuestionsListResponse>(endpoint)
  },

  /**
   * Get a single question with answers
   */
  async getQuestionById(questionId: string): Promise<QuestionWithAnswers> {
    return apiClient.get<QuestionWithAnswers>(`/api/qna/questions/${questionId}`)
  },

  /**
   * Create a new question
   */
  async createQuestion(input: CreateQuestionInput): Promise<Question> {
    return apiClient.post<Question>('/api/qna/questions', input)
  },

  /**
   * Update a question
   */
  async updateQuestion(questionId: string, input: Partial<CreateQuestionInput>): Promise<Question> {
    return apiClient.patch<Question>(`/api/qna/questions/${questionId}`, input)
  },

  /**
   * Delete a question
   */
  async deleteQuestion(questionId: string): Promise<void> {
    return apiClient.delete<void>(`/api/qna/questions/${questionId}`)
  },

  /**
   * Vote on a question
   */
  async voteQuestion(questionId: string, vote: VoteInput): Promise<{ votes: number }> {
    return apiClient.post<{ votes: number }>(`/api/qna/questions/${questionId}/vote`, vote)
  },

  /**
   * Set bounty on a question
   */
  async setBounty(questionId: string, amount: number): Promise<Question> {
    return apiClient.post<Question>(`/api/qna/questions/${questionId}/bounty`, { amount })
  },

  /**
   * Create an answer for a question
   */
  async createAnswer(input: CreateAnswerInput): Promise<Answer> {
    return apiClient.post<Answer>(`/api/qna/questions/${input.questionId}/answers`, input)
  },

  /**
   * Update an answer
   */
  async updateAnswer(answerId: string, content: string): Promise<Answer> {
    return apiClient.patch<Answer>(`/api/qna/answers/${answerId}`, { content })
  },

  /**
   * Delete an answer
   */
  async deleteAnswer(answerId: string): Promise<void> {
    return apiClient.delete<void>(`/api/qna/answers/${answerId}`)
  },

  /**
   * Vote on an answer
   */
  async voteAnswer(answerId: string, vote: VoteInput): Promise<{ votes: number }> {
    return apiClient.post<{ votes: number }>(`/api/qna/answers/${answerId}/vote`, vote)
  },

  /**
   * Accept an answer (question author only)
   */
  async acceptAnswer(answerId: string): Promise<Answer> {
    return apiClient.post<Answer>(`/api/qna/answers/${answerId}/accept`)
  },

  /**
   * Get available tags for Q&A
   */
  async getTags(): Promise<string[]> {
    return apiClient.get<string[]>('/api/qna/tags')
  },
}
