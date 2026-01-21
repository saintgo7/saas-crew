import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { communityApi } from '@/lib/api/community'
import type {
  PostFilters,
  CreatePostInput,
  CreateCommentInput,
  VoteInput,
} from '@/lib/api/types'

/**
 * Hook to fetch all posts with optional filtering
 */
export const usePosts = (filters?: PostFilters) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => communityApi.getPosts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to fetch a single post with comments
 */
export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => communityApi.getPostById(postId),
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to create a new post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreatePostInput) => communityApi.createPost(input),
    onSuccess: () => {
      // Invalidate posts list to show new post
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * Hook to vote on a post with optimistic updates
 */
export const useVotePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      vote,
    }: {
      postId: string
      vote: VoteInput
    }) => communityApi.votePost(postId, vote),
    onMutate: async ({ postId, vote }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['post', postId] })
      await queryClient.cancelQueries({ queryKey: ['posts'] })

      // Snapshot previous values
      const previousPost = queryClient.getQueryData(['post', postId])
      const previousPosts = queryClient.getQueryData(['posts'])

      // Optimistically update post detail
      queryClient.setQueryData(['post', postId], (old: any) => {
        if (!old) return old
        const delta = vote.type === 'upvote' ? 1 : -1
        return {
          ...old,
          votes: old.votes + delta,
          hasVoted: true,
          voteType: vote.type,
        }
      })

      // Optimistically update posts list
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old?.posts) return old
        return {
          ...old,
          posts: old.posts.map((post: any) =>
            post.id === postId
              ? {
                  ...post,
                  votes: post.votes + (vote.type === 'upvote' ? 1 : -1),
                  hasVoted: true,
                  voteType: vote.type,
                }
              : post
          ),
        }
      })

      return { previousPost, previousPosts }
    },
    onError: (err, { postId }, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(['post', postId], context.previousPost)
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts)
      }
    },
    onSettled: (data, error, { postId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * Hook to create a comment
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCommentInput) =>
      communityApi.createComment(input),
    onSuccess: (_, variables) => {
      // Invalidate post to show new comment
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] })
    },
  })
}

/**
 * Hook to vote on a comment with optimistic updates
 */
export const useVoteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      commentId,
      postId,
      vote,
    }: {
      commentId: string
      postId: string
      vote: VoteInput
    }) => communityApi.voteComment(commentId, vote),
    onMutate: async ({ commentId, postId, vote }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['post', postId] })

      // Snapshot previous value
      const previousPost = queryClient.getQueryData(['post', postId])

      // Optimistically update comment votes
      queryClient.setQueryData(['post', postId], (old: any) => {
        if (!old?.comments) return old

        const updateComment = (comments: any[]): any[] => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              const delta = vote.type === 'upvote' ? 1 : -1
              return {
                ...comment,
                votes: comment.votes + delta,
                hasVoted: true,
                voteType: vote.type,
              }
            }
            if (comment.replies?.length) {
              return {
                ...comment,
                replies: updateComment(comment.replies),
              }
            }
            return comment
          })
        }

        return {
          ...old,
          comments: updateComment(old.comments),
        }
      })

      return { previousPost }
    },
    onError: (err, { postId }, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(['post', postId], context.previousPost)
      }
    },
    onSettled: (data, error, { postId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    },
  })
}

/**
 * Hook to accept a comment as best answer
 */
export const useAcceptComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      commentId,
      postId,
    }: {
      commentId: string
      postId: string
    }) => communityApi.acceptComment(commentId),
    onSuccess: (_, variables) => {
      // Invalidate post to update accepted status
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * Hook to fetch available tags
 */
export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => communityApi.getTags(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
