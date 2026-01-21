import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'

/**
 * JWT Strategy
 * Validates JWT tokens in Authorization header
 * Extracts user from token payload
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') || 'development-secret-key',
    })
  }

  /**
   * Validate JWT payload
   * Called automatically by Passport after token verification
   * Returns user object which will be attached to request
   */
  async validate(payload: any) {
    const user = await this.authService.validateUser(payload)

    if (!user) {
      throw new UnauthorizedException('Invalid token')
    }

    return user
  }
}

