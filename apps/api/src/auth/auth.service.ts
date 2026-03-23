import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

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
   * Register new user with email/password
   * Only @wku.ac.kr email domain is allowed
   */
  async register(dto: RegisterDto) {
    // Validate email domain
    if (!dto.email.endsWith('@wku.ac.kr')) {
      throw new BadRequestException('@wku.ac.kr 이메일만 사용할 수 있습니다')
    }

    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(dto.email)
    if (existingUser) {
      throw new ConflictException('이미 등록된 이메일입니다')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    // Create user
    const newUser = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    })

    // Fetch full user data
    const user = await this.usersService.findById(newUser.id)

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
   * Login with email/password
   */
  async loginWithEmail(dto: LoginDto) {
    // Find user by email
    const user = await this.usersService.findByEmail(dto.email)

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    // If user has no password (OAuth user), suggest OAuth login
    if (!user.password) {
      throw new UnauthorizedException('GitHub 로그인을 사용해주세요')
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다')
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
