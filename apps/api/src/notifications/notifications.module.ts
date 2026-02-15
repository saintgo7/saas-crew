import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { NotificationsGateway } from './notifications.gateway'

/**
 * Notifications Module
 * Provides notification management and real-time delivery
 *
 * Features:
 * - REST API endpoints for notification CRUD
 * - WebSocket gateway for real-time notifications
 * - JWT authentication for WebSocket connections
 * - Support for multiple notification types (Q&A, social, system, mentoring)
 *
 * Dependencies:
 * - PrismaService (global, from PrismaModule)
 * - JwtService (for WebSocket token verification)
 */
@Module({
  imports: [
    // JWT for WebSocket authentication
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'development-secret-key',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
