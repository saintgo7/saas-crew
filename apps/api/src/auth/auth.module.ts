import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { GithubStrategy } from './github.strategy'
import { UsersModule } from '../users/users.module'

/**
 * Auth Module
 * Handles authentication and authorization
 * Dependencies: UsersModule for user management
 */
@Module({
  imports: [
    // Import UsersModule to access UsersService
    UsersModule,
    // Configure Passport with JWT as default strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configure JWT with async factory for environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'development-secret-key',
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GithubStrategy],
  exports: [AuthService],
})
export class AuthModule {}
