import { Controller, Get, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'

/**
 * Auth Controller
 * Handles authentication endpoints
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
   */
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({
    summary: 'Initiate GitHub OAuth',
    description: 'Redirects to GitHub authorization page to start OAuth flow',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to GitHub OAuth authorization page',
  })
  githubLogin() {
    // Guard handles redirect to GitHub
  }

  /**
   * GET /api/auth/github/callback
   * GitHub OAuth callback endpoint
   * Processes OAuth response and redirects to frontend with token
   */
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
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
  getMe(@Req() req: any) {
    return req.user
  }
}
