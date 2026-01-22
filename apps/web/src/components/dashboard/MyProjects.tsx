'use client'

import { Calendar, Users, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Project } from '@/lib/api/types'

interface MyProjectsProps {
  projects: Project[]
}

const statusConfig = {
  planning: { label: '계획중', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
  in_progress: { label: '진행중', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  completed: { label: '완료', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  archived: { label: '보관됨', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
}

export function MyProjects({ projects }: MyProjectsProps) {
  if (projects.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          내 프로젝트
        </h3>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>진행중인 프로젝트가 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        내 프로젝트 ({projects.length})
      </h3>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                  {project.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>
              {project.status && (
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    statusConfig[project.status].color
                  }`}
                >
                  {statusConfig[project.status].label}
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {project.progress !== undefined && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>진행률</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              {project.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {format(new Date(project.startDate), 'yyyy.MM.dd', { locale: ko })}
                  </span>
                </div>
              )}
              {project.teamMembers && (
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{project.teamMembers.length}명</span>
                </div>
              )}
              {project._count && (
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{project._count.members}명</span>
                </div>
              )}
              {project.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <div className="flex gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Team Members */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">팀원:</span>
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 5).map((member) => (
                      <div
                        key={member.userId}
                        className="relative group"
                        title={member.name}
                      >
                        {member.profileImage ? (
                          <img
                            src={member.profileImage}
                            alt={member.name}
                            className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white font-semibold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                    {project.teamMembers.length > 5 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold">
                        +{project.teamMembers.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
