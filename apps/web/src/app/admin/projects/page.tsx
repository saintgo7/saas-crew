'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import {
  Search,
  Folder,
  ExternalLink,
  Github,
  MoreVertical,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Archive,
  Trash2,
  Users,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  Globe,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface Project {
  id: string
  name: string
  slug: string
  description: string
  visibility: 'PUBLIC' | 'PRIVATE'
  status: string
  githubRepo?: string
  deployUrl?: string
  createdAt: string
  owner?: {
    id: string
    name: string
    email: string
  }
  _count?: {
    members: number
  }
}

const statusColors: Record<string, string> = {
  planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
  pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const statusLabels: Record<string, string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
  pending: 'Pending Review',
  rejected: 'Rejected',
}

const ITEMS_PER_PAGE = 12

export default function AdminProjectsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isModerateModalOpen, setIsModerateModalOpen] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-projects', page, statusFilter, visibilityFilter],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      })
      if (statusFilter) params.append('status', statusFilter)
      if (visibilityFilter) params.append('visibility', visibilityFilter)

      const res = await fetch(`${API_BASE_URL}/api/projects?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ projectId, status }: { projectId: string; status: string }) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update project status')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      setIsModerateModalOpen(false)
      setSelectedProject(null)
      setActionMenuOpen(null)
    },
  })

  const updateVisibilityMutation = useMutation({
    mutationFn: async ({ projectId, visibility }: { projectId: string; visibility: string }) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ visibility }),
      })
      if (!res.ok) throw new Error('Failed to update project visibility')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      setActionMenuOpen(null)
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete project')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      setDeleteConfirm(null)
    },
  })

  const projects: Project[] = data?.data || []
  const totalProjects = data?.meta?.total || 0
  const totalPages = Math.ceil(totalProjects / ITEMS_PER_PAGE)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project)
    setIsDetailModalOpen(true)
    setActionMenuOpen(null)
  }

  const openModerateModal = (project: Project) => {
    setSelectedProject(project)
    setIsModerateModalOpen(true)
    setActionMenuOpen(null)
  }

  const handleStatusChange = (status: string) => {
    if (selectedProject) {
      updateStatusMutation.mutate({ projectId: selectedProject.id, status })
    }
  }

  const handleVisibilityToggle = (project: Project) => {
    const newVisibility = project.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC'
    updateVisibilityMutation.mutate({ projectId: project.id, visibility: newVisibility })
  }

  const handleApprove = (project: Project) => {
    updateStatusMutation.mutate({ projectId: project.id, status: 'in_progress' })
  }

  const handleReject = (project: Project) => {
    updateStatusMutation.mutate({ projectId: project.id, status: 'rejected' })
  }

  const handleArchive = (project: Project) => {
    updateStatusMutation.mutate({ projectId: project.id, status: 'archived' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Project Management
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          View and moderate registered projects
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="pending">Pending Review</option>
          <option value="planning">Planning</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={visibilityFilter}
          onChange={(e) => {
            setVisibilityFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Visibility</option>
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>
      </div>

      {/* Project List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Failed to load projects
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">No projects found</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.visibility === 'PRIVATE' ? (
                      <Lock className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Globe className="h-4 w-4 text-green-500" />
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === project.id ? null : project.id)}
                        className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Action Dropdown */}
                      {actionMenuOpen === project.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                          <button
                            onClick={() => openProjectDetail(project)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => openModerateModal(project)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Moderate
                          </button>
                          <button
                            onClick={() => handleVisibilityToggle(project)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {project.visibility === 'PUBLIC' ? (
                              <>
                                <EyeOff className="h-4 w-4" />
                                Make Private
                              </>
                            ) : (
                              <>
                                <Globe className="h-4 w-4" />
                                Make Public
                              </>
                            )}
                          </button>
                          {project.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(project)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-100 dark:text-green-400 dark:hover:bg-gray-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(project)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </button>
                            </>
                          )}
                          {project.status !== 'archived' && (
                            <button
                              onClick={() => handleArchive(project)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Archive className="h-4 w-4" />
                              Archive
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm(project.id)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <span
                  className={cn(
                    'mb-3 inline-block rounded-full px-2 py-1 text-xs font-medium',
                    statusColors[project.status] || statusColors.planning
                  )}
                >
                  {statusLabels[project.status] || project.status}
                </span>

                <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {project._count?.members || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.githubRepo && (
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.deployUrl && (
                      <a
                        href={project.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages} ({totalProjects} total projects)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredProjects.length} projects
      </div>

      {/* Project Detail Modal */}
      {isDetailModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Project Details
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedProject.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        statusColors[selectedProject.status]
                      )}
                    >
                      {statusLabels[selectedProject.status]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      {selectedProject.visibility === 'PRIVATE' ? (
                        <>
                          <Lock className="h-3 w-3" />
                          Private
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3" />
                          Public
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {selectedProject.description}
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Members
                    </label>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                      {selectedProject._count?.members || 0} members
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Created
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {new Date(selectedProject.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  {selectedProject.owner && (
                    <div className="col-span-2">
                      <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        Owner
                      </label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {selectedProject.owner.name} ({selectedProject.owner.email})
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {selectedProject.githubRepo && (
                    <a
                      href={selectedProject.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  {selectedProject.deployUrl && (
                    <a
                      href={selectedProject.deployUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-700">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false)
                  openModerateModal(selectedProject)
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <CheckCircle className="h-4 w-4" />
                Moderate
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Modal */}
      {isModerateModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Moderate Project
              </h2>
              <button
                onClick={() => setIsModerateModalOpen(false)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Update status for <strong>{selectedProject.name}</strong>:
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusChange('planning')}
                  disabled={updateStatusMutation.isPending}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 transition-colors',
                    selectedProject.status === 'planning'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Planning</p>
                    <p className="text-xs text-gray-500">Project is in planning phase</p>
                  </div>
                </button>

                <button
                  onClick={() => handleStatusChange('in_progress')}
                  disabled={updateStatusMutation.isPending}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 transition-colors',
                    selectedProject.status === 'in_progress'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">In Progress</p>
                    <p className="text-xs text-gray-500">Approved and actively developed</p>
                  </div>
                </button>

                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={updateStatusMutation.isPending}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 transition-colors',
                    selectedProject.status === 'completed'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Completed</p>
                    <p className="text-xs text-gray-500">Project is finished</p>
                  </div>
                </button>

                <button
                  onClick={() => handleStatusChange('archived')}
                  disabled={updateStatusMutation.isPending}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 transition-colors',
                    selectedProject.status === 'archived'
                      ? 'border-gray-500 bg-gray-50 dark:bg-gray-700'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Archive className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Archived</p>
                    <p className="text-xs text-gray-500">Project is archived</p>
                  </div>
                </button>

                <button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={updateStatusMutation.isPending}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 transition-colors',
                    selectedProject.status === 'rejected'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Rejected</p>
                    <p className="text-xs text-gray-500">Project does not meet criteria</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-700">
              <button
                onClick={() => setIsModerateModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Project
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProjectMutation.mutate(deleteConfirm)}
                disabled={deleteProjectMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handler for dropdown */}
      {actionMenuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActionMenuOpen(null)}
        />
      )}
    </div>
  )
}
