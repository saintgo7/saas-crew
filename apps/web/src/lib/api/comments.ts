import { apiClient } from './client'

/**
 * Comment types
 */
export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  parentId?: string
  accepted: boolean
  author: {
    id: string
    name: string
    avatar?: string
    level: number
    rank: string
  }
  replies?: Comment[]
  likeCount?: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCommentDto {
  content: string
  parentId?: string
}

export interface UpdateCommentDto {
  content: string
}

export interface LikeStatus {
  likeCount: number
  isLiked: boolean
}

/**
 * Get comments for a post
 */
export async function getComments(postId: string): Promise<Comment[]> {
  return apiClient.get(`/posts/${postId}/comments`)
}

/**
 * Create a comment
 */
export async function createComment(
  postId: string,
  data: CreateCommentDto,
): Promise<Comment> {
  return apiClient.post(`/posts/${postId}/comments`, data)
}

/**
 * Update a comment
 */
export async function updateComment(
  id: string,
  data: UpdateCommentDto,
): Promise<Comment> {
  return apiClient.patch(`/comments/${id}`, data)
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<{ message: string }> {
  return apiClient.delete(`/comments/${id}`)
}

/**
 * Accept a comment as the answer
 */
export async function acceptAnswer(id: string): Promise<Comment> {
  return apiClient.post(`/comments/${id}/accept`)
}

/**
 * Like a comment
 */
export async function likeComment(
  id: string,
): Promise<{ message: string; liked: boolean; likeCount: number }> {
  return apiClient.post(`/comments/${id}/like`)
}

/**
 * Unlike a comment
 */
export async function unlikeComment(
  id: string,
): Promise<{ message: string; liked: boolean; likeCount: number }> {
  return apiClient.delete(`/comments/${id}/like`)
}

/**
 * Get like status for a comment
 */
export async function getLikeStatus(id: string): Promise<LikeStatus> {
  return apiClient.get(`/comments/${id}/like`)
}
