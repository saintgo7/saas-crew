/**
 * Shared constants
 */

export const API_ENDPOINTS = {
  AUTH: {
    GITHUB: '/api/auth/github',
    GITHUB_CALLBACK: '/api/auth/github/callback',
    ME: '/api/auth/me',
  },
  USERS: {
    PROFILE: '/api/users/:id',
    UPDATE: '/api/users/:id',
    PROJECTS: '/api/users/:id/projects',
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const TOKEN_KEY = 'wku_crew_token'
