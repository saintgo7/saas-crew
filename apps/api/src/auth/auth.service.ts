import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

/**
 * GitHub OAuth Profile Interface
 */
interface GithubProfile {
  id: string
  login: string
  name: string
  email: string
  avatar_url: string
}

/**
 * JWT Payload Interface
 */
interface JwtPayload {
  sub: string // User ID
  email: string
  rank: string
}

/**
 * Auth Service
 * Handles authentication logic
 * Clean Architecture: Service layer for authentication business logic
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Handle GitHub OAuth login
   * Creates new user if not exists, returns JWT token
   */
  async handleGithubLogin(profile: GithubProfile) {
    // Find existing user by GitHub ID
    const existingUser = await this.usersService.findByGithubId(profile.id)

    let user
    if (!existingUser) {
      // Create new user if doesn't exist
      const newUser = await this.usersService.create({
        githubId: profile.id,
        email: profile.email || `${profile.login}@github.local`,
        name: profile.name || profile.login,
        avatar: profile.avatar_url || undefined,
      })

      // Fetch full user data
      user = await this.usersService.findById(newUser.id)
    } else {
      user = existingUser
    }

    // Generate JWT token
    const payload: JwtPayload = {
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
        avatar: user.avatar || undefined,
        rank: user.rank,
        level: user.level,
      },
    }
  }

  /**
   * Validate JWT payload and return user
   * Used by JWT strategy
   */
  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub)

    if (!user) {
      throw new UnauthorizedException('Invalid token')
    }

    return user
  }

  /**
   * Generate JWT token for user
   */
  generateToken(user: { id: string; email: string; rank: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      rank: user.rank,
    }

    return this.jwtService.sign(payload)
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
