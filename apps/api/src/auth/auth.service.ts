import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'

interface GithubProfile {
  id: string
  login: string
  name: string
  email: string
  avatar_url: string
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async handleGithubLogin(profile: GithubProfile) {
    // 기존 사용자 찾기 또는 생성
    let user = await this.prisma.user.findUnique({
      where: { githubId: profile.id },
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          githubId: profile.id,
          email: profile.email || `${profile.login}@github.local`,
          name: profile.name || profile.login,
          avatar: profile.avatar_url,
        },
      })
    }

    // JWT 토큰 생성
    const payload = {
      sub: user.id,
      email: user.email,
      rank: user.rank,
    }

    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        rank: user.rank,
        level: user.level,
      },
    }
  }

  async validateUser(payload: any) {
    return this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        rank: true,
        level: true,
        xp: true,
      },
    })
  }
}
