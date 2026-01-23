'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  User as UserIcon,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface User {
  id: string
  name: string
  email: string
  level: number
  rank: string
  role: 'student' | 'mentor' | 'admin'
  department?: string
  isActive?: boolean
  createdAt: string
}

const rankColors: Record<string, string> = {
  JUNIOR: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  SENIOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  MASTER: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
}

const rankLabels: Record<string, string> = {
  JUNIOR: 'Junior',
  SENIOR: 'Senior',
  MASTER: 'Master',
}

const roleColors: Record<string, string> = {
  student: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  mentor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const roleLabels: Record<string, string> = {
  student: 'Member',
  mentor: 'Mentor',
  admin: 'Admin',
}

const ITEMS_PER_PAGE = 10

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [rankFilter, setRankFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/users?page=${page}&limit=${ITEMS_PER_PAGE}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      return {
        users: data.users as User[],
        total: data.total || data.users?.length || 0,
      }
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error('Failed to update user role')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsRoleModalOpen(false)
      setSelectedUser(null)
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      })
      if (!res.ok) throw new Error('Failed to update user status')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setActionMenuOpen(null)
    },
  })

  const users = data?.users || []
  const totalUsers = data?.total || 0
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRank = !rankFilter || user.rank === rankFilter
    const matchesRole = !roleFilter || user.role === roleFilter
    return matchesSearch && matchesRank && matchesRole
  })

  const openUserDetail = (user: User) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
    setActionMenuOpen(null)
  }

  const openRoleModal = (user: User) => {
    setSelectedUser(user)
    setIsRoleModalOpen(true)
    setActionMenuOpen(null)
  }

  const handleRoleChange = (role: string) => {
    if (selectedUser) {
      updateRoleMutation.mutate({ userId: selectedUser.id, role })
    }
  }

  const handleToggleStatus = (user: User) => {
    toggleStatusMutation.mutate({ userId: user.id, isActive: !user.isActive })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          View and manage registered users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <select
          value={rankFilter}
          onChange={(e) => setRankFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Ranks</option>
          <option value="JUNIOR">Junior</option>
          <option value="SENIOR">Senior</option>
          <option value="MASTER">Master</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Roles</option>
          <option value="student">Member</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* User List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Failed to load users
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  User
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">
                  Role
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">
                  Rank
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                  Department
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                  Level
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                  Status
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          user.isActive !== false
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "bg-gray-100 dark:bg-gray-700"
                        )}>
                          <UserIcon className={cn(
                            "h-5 w-5",
                            user.isActive !== false
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400"
                          )} />
                        </div>
                        <div>
                          <p className={cn(
                            "font-medium",
                            user.isActive !== false
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          )}>
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell">
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium',
                          roleColors[user.role] || 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell">
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium',
                          rankColors[user.rank] || 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {rankLabels[user.rank] || user.rank}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {user.department || '-'}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Lv.{user.level}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                          user.isActive !== false
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        )}
                      >
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Action Dropdown */}
                        {actionMenuOpen === user.id && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            <button
                              onClick={() => openUserDetail(user)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => openRoleModal(user)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Shield className="h-4 w-4" />
                              Change Role
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={cn(
                                "flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                                user.isActive !== false
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-green-600 dark:text-green-400"
                              )}
                            >
                              {user.isActive !== false ? (
                                <>
                                  <UserX className="h-4 w-4" />
                                  Deactivate User
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4" />
                                  Activate User
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages} ({totalUsers} total users)
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
        Showing {filteredUsers.length} users
      </div>

      {/* User Detail Modal */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Details
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <UserIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    {selectedUser.email}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Role
                    </label>
                    <p className="mt-1">
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium',
                          roleColors[selectedUser.role]
                        )}
                      >
                        {roleLabels[selectedUser.role]}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Rank
                    </label>
                    <p className="mt-1">
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium',
                          rankColors[selectedUser.rank]
                        )}
                      >
                        {rankLabels[selectedUser.rank] || selectedUser.rank}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Level
                    </label>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                      Lv.{selectedUser.level}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Status
                    </label>
                    <p className="mt-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                          selectedUser.isActive !== false
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        )}
                      >
                        {selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Department
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedUser.department || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Joined
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {new Date(selectedUser.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-700">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false)
                  openRoleModal(selectedUser)
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Shield className="h-4 w-4" />
                Change Role
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

      {/* Role Change Modal */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Change User Role
              </h2>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Select a new role for <strong>{selectedUser.name}</strong>:
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleRoleChange('student')}
                  disabled={updateRoleMutation.isPending}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-4 transition-colors',
                    selectedUser.role === 'student'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                    <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Member</p>
                    <p className="text-sm text-gray-500">Standard member access</p>
                  </div>
                  {selectedUser.role === 'student' && (
                    <ShieldCheck className="ml-auto h-5 w-5 text-blue-600" />
                  )}
                </button>

                <button
                  onClick={() => handleRoleChange('mentor')}
                  disabled={updateRoleMutation.isPending}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-4 transition-colors',
                    selectedUser.role === 'mentor'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Mentor</p>
                    <p className="text-sm text-gray-500">Can guide and assist members</p>
                  </div>
                  {selectedUser.role === 'mentor' && (
                    <ShieldCheck className="ml-auto h-5 w-5 text-blue-600" />
                  )}
                </button>

                <button
                  onClick={() => handleRoleChange('admin')}
                  disabled={updateRoleMutation.isPending}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-4 transition-colors',
                    selectedUser.role === 'admin'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Admin</p>
                    <p className="text-sm text-gray-500">Full administrative access</p>
                  </div>
                  {selectedUser.role === 'admin' && (
                    <ShieldCheck className="ml-auto h-5 w-5 text-blue-600" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-700">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
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
