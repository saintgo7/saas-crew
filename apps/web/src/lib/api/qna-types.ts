/**
 * Q&A System Types
 */

export interface QuestionAuthor {
  id: string
  name: string
  profileImage?: string
  level: number
}

export interface Answer {
  id: string
  questionId: string
  authorId: string
  author: QuestionAuthor
  content: string
  votes: number
  hasVoted?: boolean
  voteType?: 'upvote' | 'downvote'
  isAccepted: boolean
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  title: string
  content: string
  authorId: string
  author: QuestionAuthor
  tags: string[]
  votes: number
  hasVoted?: boolean
  voteType?: 'upvote' | 'downvote'
  views: number
  answersCount: number
  hasAcceptedAnswer: boolean
  bounty?: number
  bountyExpiresAt?: string
  status: 'open' | 'answered' | 'closed'
  createdAt: string
  updatedAt: string
}

export interface QuestionWithAnswers extends Question {
  answers: Answer[]
}

export interface QuestionsListResponse {
  questions: Question[]
  total: number
  page: number
  pageSize: number
}

export type QuestionSortBy = 'newest' | 'oldest' | 'most_votes' | 'most_answers' | 'most_views' | 'bounty'
export type QuestionStatus = 'all' | 'open' | 'answered'

export interface QuestionFilters {
  tag?: string
  search?: string
  status?: QuestionStatus
  sortBy?: QuestionSortBy
  hasBounty?: boolean
  page?: number
  pageSize?: number
}

export interface CreateQuestionInput {
  title: string
  content: string
  tags: string[]
  bounty?: number
}

export interface CreateAnswerInput {
  questionId: string
  content: string
}

// VoteInput is exported from types.ts
