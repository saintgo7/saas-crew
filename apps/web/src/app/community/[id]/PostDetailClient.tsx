'use client'

import { usePost, useVotePost, useVoteComment, useCreateComment, useAcceptComment } from '@/lib/hooks/use-community'
import { PostDetail } from '@/components/community'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useUserStore } from '@/store/user-store'

interface PostDetailClientProps {
  postId: string
}

export function PostDetailClient({ postId }: PostDetailClientProps) {
  const { data: post, isLoading, error } = usePost(postId)
  const votePost = useVotePost()
  const voteComment = useVoteComment()
  const createComment = useCreateComment()
  const acceptComment = useAcceptComment()
  const currentUser = useUserStore((state) => state.user)

  const handleVote = async (type: 'upvote' | 'downvote') => {
    await votePost.mutateAsync({ postId, vote: { type } })
  }

  const handleCommentVote = async (
    commentId: string,
    type: 'upvote' | 'downvote'
  ) => {
    await voteComment.mutateAsync({
      commentId,
      postId,
      vote: { type },
    })
  }

  const handleCreateComment = async (content: string) => {
    await createComment.mutateAsync({
      postId,
      content,
    })
  }

  const handleReply = async (parentId: string, content: string) => {
    await createComment.mutateAsync({
      postId,
      parentId,
      content,
    })
  }

  const handleAcceptComment = async (commentId: string) => {
    await acceptComment.mutateAsync({ commentId, postId })
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              게시글을 불러오는데 실패했습니다
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error instanceof Error
                ? error.message
                : '알 수 없는 오류가 발생했습니다'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !post) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            게시글을 불러오는 중...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>커뮤니티로 돌아가기</span>
      </Link>

      {/* Post Detail */}
      <PostDetail
        post={post}
        currentUserId={currentUser?.id}
        onVote={handleVote}
        onCommentVote={handleCommentVote}
        onReply={handleReply}
        onCreateComment={handleCreateComment}
        onAcceptComment={handleAcceptComment}
      />
    </div>
  )
}
