import { Controller, Get, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'

/**
 * Auth Controller
 * Handles authentication endpoints
 * Clean Architecture: Controller -> Service
 */
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
  getMe(@Req() req: any) {
    return req.user
  }
}
