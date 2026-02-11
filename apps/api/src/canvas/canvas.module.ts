import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CanvasController } from './canvas.controller'
import { CanvasService } from './canvas.service'
import { CanvasGateway } from './canvas.gateway'

@Module({
  imports: [
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
  controllers: [CanvasController],
  providers: [CanvasGateway, CanvasService],
  exports: [CanvasService],
})
export class CanvasModule {}
