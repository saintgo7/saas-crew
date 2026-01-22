import { notFound } from 'next/navigation'
import { Github, ExternalLink, Users, Calendar, Eye, Lock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Metadata } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface PageProps {
  params: {
    id: string
  }
}

async function getProject(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch project')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const project = await getProject(params.id)

  if (!project) {
    return {
      title: '프로젝트를 찾을 수 없습니다 | WKU Software Crew',
    }
  }

  return {
    title: `${project.name} | WKU Software Crew`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {project.visibility === 'PUBLIC' ? (
              <>
                <Eye className="h-4 w-4" />
                <span>공개 프로젝트</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>비공개 프로젝트</span>
              </>
            )}
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Members */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">참여 인원</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {project._count?.members || 0}명
                </p>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">생성일</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDistanceToNow(new Date(project.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        {(project.githubRepo || project.deployUrl) && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              링크
            </h2>
            <div className="space-y-3">
              {project.githubRepo && (
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                >
                  <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      GitHub Repository
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.githubRepo}
                    </p>
                  </div>
                </a>
              )}

              {project.deployUrl && (
                <a
                  href={project.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                >
                  <ExternalLink className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      배포된 사이트
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.deployUrl}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Cover Image */}
        {project.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <img
              src={project.coverImage}
              alt={project.name}
              className="h-auto w-full"
            />
          </div>
        )}

        {/* Additional Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            프로젝트 정보
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">프로젝트 ID</dt>
              <dd className="font-mono text-sm text-gray-900 dark:text-white">
                {project.id}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Slug</dt>
              <dd className="font-mono text-sm text-gray-900 dark:text-white">
                {project.slug}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">생성일</dt>
              <dd className="text-gray-900 dark:text-white">
                {new Date(project.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
            {project.updatedAt && (
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">최종 수정일</dt>
                <dd className="text-gray-900 dark:text-white">
                  {new Date(project.updatedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}
