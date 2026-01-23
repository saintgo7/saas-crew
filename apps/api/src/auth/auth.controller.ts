import { Controller, Get, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'

/**
 * Auth Controller
 * Handles authentication endpoints with rate limiting
 * Clean Architecture: Controller -> Service
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * GET /api/auth/github
   * Initiates GitHub OAuth flow
   * Redirects to GitHub authorization page
   * Rate limit: 5 requests per 5 minutes
   */
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @HttpCode(HttpStatus.FOUND)
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({
    summary: 'Initiate GitHub OAuth',
    description: 'Redirects to GitHub authorization page to start OAuth flow',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to GitHub OAuth authorization page',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - Rate limit exceeded',
  })
  githubLogin() {
    // Guard handles redirect to GitHub
  }

  /**
   * GET /api/auth/github/callback
   * GitHub OAuth callback endpoint
   * Processes OAuth response and redirects to frontend with token
   * Rate limit: 10 requests per 5 minutes
   */
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @Throttle({ short: { limit: 10, ttl: 300000 } }) // 10 requests per 5 minutes
  @ApiOperation({
    summary: 'GitHub OAuth callback',
    description:
      'Handles GitHub OAuth callback, creates/updates user, and redirects to frontend with JWT token',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend with JWT token in query parameter',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - Rate limit exceeded',
  })
  async githubCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken, user } = await this.authService.handleGithubLogin(req.user)

    // Redirect to frontend with token
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000'
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`)
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user
   * Protected endpoint - requires JWT
   * Rate limit: 100 requests per minute (default)
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the currently authenticated user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        name: 'John Doe',
        avatar: 'https://github.com/username.png',
        githubId: '12345678',
        department: 'Computer Science',
        grade: 3,
        bio: 'Full-stack developer',
        theme: 'dark',
        language: 'ko',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - Rate limit exceeded',
  })
  getMe(@Req() req: any) {
    return req.user
  }
}
