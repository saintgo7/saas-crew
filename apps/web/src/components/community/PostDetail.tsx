'use client'

import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Eye, Calendar, CheckCircle2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { VoteButtons } from './VoteButtons'
import { CommentList } from './CommentList'
import type { PostWithComments } from '@/lib/api/types'

interface PostDetailProps {
  post: PostWithComments
  currentUserId?: string
  onVote: (type: 'upvote' | 'downvote') => Promise<void>
  onCommentVote: (commentId: string, type: 'upvote' | 'downvote') => Promise<void>
  onReply: (parentId: string, content: string) => Promise<void>
  onCreateComment: (content: string) => Promise<void>
  onAcceptComment?: (commentId: string) => Promise<void>
}

export function PostDetail({
  post,
  currentUserId,
  onVote,
  onCommentVote,
  onReply,
  onCreateComment,
  onAcceptComment,
}: PostDetailProps) {
  const isAuthor = currentUserId === post.authorId

  return (
    <div className="space-y-8">
      {/* Post Content */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="mb-4 flex items-start gap-4">
            <VoteButtons
              votes={post.votes}
              hasVoted={post.hasVoted}
              voteType={post.voteType}
              onVote={onVote}
            />

            <div className="flex-1">
              <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                {post.title}
                {post.hasAcceptedAnswer && (
                  <CheckCircle2 className="ml-3 inline-block h-7 w-7 text-green-600" />
                )}
              </h1>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {post.author.profileImage ? (
                    <img
                      src={post.author.profileImage}
                      alt={post.author.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {post.author.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Lv.{post.author.level}
                  </span>
                </div>

                {/* Created At */}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>

                {/* Views */}
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>조회 {post.views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-headings:dark:text-white prose-p:text-gray-700 prose-p:dark:text-gray-300 prose-a:text-blue-600 prose-a:dark:text-blue-400 prose-strong:text-gray-900 prose-strong:dark:text-white prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-gray-900 prose-code:dark:bg-gray-700 prose-code:dark:text-gray-100 prose-pre:bg-gray-900 prose-pre:dark:bg-gray-950">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentList
        comments={post.comments}
        postId={post.id}
        postAuthorId={post.authorId}
        currentUserId={currentUserId}
        onVote={onCommentVote}
        onReply={onReply}
        onCreateComment={onCreateComment}
        onAccept={isAuthor ? onAcceptComment : undefined}
      />
    </div>
  )
}
