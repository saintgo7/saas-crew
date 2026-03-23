import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
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
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

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
   * POST /api/auth/register
   * Register with WKU email and password
   * Only @wku.ac.kr email domain is allowed
   * Rate limit: 3 requests per minute
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  @ApiOperation({
    summary: 'Register with email/password',
    description:
      'Creates a new user account. Only @wku.ac.kr email addresses are accepted. Any pseudonym can be used as the display name.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'student@wku.ac.kr',
          name: '코딩마스터',
          rank: 'JUNIOR',
          level: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or non-WKU email domain',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - Rate limit exceeded',
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  /**
   * POST /api/auth/login
   * Login with email and password
   * Rate limit: 10 requests per minute
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({
    summary: 'Login with email/password',
    description: 'Authenticates a user with email and password, returns JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'student@wku.ac.kr',
          name: '코딩마스터',
          rank: 'JUNIOR',
          level: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - Rate limit exceeded',
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.loginWithEmail(dto)
  }

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
