import { apiClient } from './client'
import type {
  PostsListResponse,
  PostWithComments,
  PostFilters,
  CreatePostInput,
  CreateCommentInput,
  VoteInput,
  Post,
  Comment,
} from './types'

/**
 * Community API client for Q&A posts and comments
 */
export const communityApi = {
  /**
   * Get all posts with optional filtering
   */
  async getPosts(filters?: PostFilters): Promise<PostsListResponse> {
    const params = new URLSearchParams()

    if (filters?.tag) params.set('tag', filters.tag)
    if (filters?.search) params.set('search', filters.search)
    if (filters?.sortBy) params.set('sortBy', filters.sortBy)
    if (filters?.page) params.set('page', filters.page.toString())
    if (filters?.pageSize) params.set('pageSize', filters.pageSize.toString())

    const query = params.toString()
    const endpoint = query ? `/api/posts?${query}` : '/api/posts'

    return apiClient.get<PostsListResponse>(endpoint)
  },

  /**
   * Get a single post with comments
   */
  async getPostById(postId: string): Promise<PostWithComments> {
    return apiClient.get<PostWithComments>(`/api/posts/${postId}`)
  },

  /**
   * Create a new post
   */
  async createPost(input: CreatePostInput): Promise<Post> {
    return apiClient.post<Post>('/api/posts', input)
  },

  /**
   * Vote on a post
   */
  async votePost(postId: string, vote: VoteInput): Promise<{ votes: number }> {
    return apiClient.post<{ votes: number }>(`/api/posts/${postId}/vote`, vote)
  },

  /**
   * Create a comment on a post
   */
  async createComment(input: CreateCommentInput): Promise<Comment> {
    return apiClient.post<Comment>(`/api/posts/${input.postId}/comments`, input)
  },

  /**
   * Vote on a comment
   */
  async voteComment(
    commentId: string,
    vote: VoteInput
  ): Promise<{ votes: number }> {
    return apiClient.post<{ votes: number }>(
      `/api/comments/${commentId}/vote`,
      vote
    )
  },

  /**
   * Accept a comment as the best answer (post author only)
   */
  async acceptComment(commentId: string): Promise<Comment> {
    return apiClient.post<Comment>(`/api/comments/${commentId}/accept`)
  },

  /**
   * Get available tags
   */
  async getTags(): Promise<string[]> {
    return apiClient.get<string[]>('/api/posts/tags')
  },
}
