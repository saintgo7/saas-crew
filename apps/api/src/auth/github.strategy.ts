import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-github2'
import { ConfigService } from '@nestjs/config'

/**
 * GitHub OAuth Strategy
 * Handles GitHub OAuth authentication
 * Extracts user profile from GitHub response
 */
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID'),
      clientSecret: config.get('GITHUB_CLIENT_SECRET'),
      callbackURL:
        config.get('GITHUB_CALLBACK_URL') ||
        'http://localhost:4000/api/auth/github/callback',
      scope: ['user:email'],
    })
  }

  /**
   * Validate GitHub OAuth response
   * Extracts user profile information
   * Returns normalized profile object
   */
  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      id: profile.id,
      login: profile.username,
      name: profile.displayName,
      email: profile.emails?.[0]?.value,
      avatar_url: profile.photos?.[0]?.value,
    }
  }
}

