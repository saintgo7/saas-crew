import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // GitHub OAuth 시작
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // GitHub으로 리다이렉트됨
  }

  // GitHub OAuth 콜백
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken, user } = await this.authService.handleGithubLogin(req.user)

    // 프론트엔드로 리다이렉트 (토큰 포함)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`)
  }

  // 현재 로그인한 사용자 정보
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: any) {
    return req.user
  }
}
