import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'

/**
 * Chat Module
 * Provides real-time chat functionality via WebSockets and REST API
 *
 * Features:
 * - WebSocket gateway with JWT authentication
 * - REST API endpoints for channels and messages
 * - Channel-based messaging
 * - Typing indicators
 * - User presence tracking
 *
 * Dependencies:
 * - PrismaService (global, from PrismaModule)
 * - JwtService (for token verification)
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
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
