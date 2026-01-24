import { apiClient } from './client'

/**
 * PostCategory types
 */
export interface PostCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  order: number
  isActive: boolean
  _count?: {
    posts: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  order?: number
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
  description?: string
  icon?: string
  color?: string
  order?: number
  isActive?: boolean
}

/**
 * Get all categories
 */
export async function getCategories(
  includeInactive = false,
): Promise<PostCategory[]> {
  const query = includeInactive ? '?includeInactive=true' : ''
  return apiClient.get(`/categories${query}`)
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<PostCategory> {
  return apiClient.get(`/categories/${id}`)
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<PostCategory> {
  return apiClient.get(`/categories/slug/${slug}`)
}

/**
 * Create a new category (admin only)
 */
export async function createCategory(
  data: CreateCategoryDto,
): Promise<PostCategory> {
  return apiClient.post('/categories', data)
}

/**
 * Update a category (admin only)
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryDto,
): Promise<PostCategory> {
  return apiClient.patch(`/categories/${id}`, data)
}

/**
 * Delete a category (admin only)
 */
export async function deleteCategory(id: string): Promise<{ message: string }> {
  return apiClient.delete(`/categories/${id}`)
}

/**
 * Reorder categories (admin only)
 */
export async function reorderCategories(
  categoryIds: string[],
): Promise<{ message: string }> {
  return apiClient.post('/categories/reorder', { categoryIds })
}
