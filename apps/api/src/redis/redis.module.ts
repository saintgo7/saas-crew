import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { RedisService } from './redis.service'

export const REDIS_CLIENT = 'REDIS_CLIENT'

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('REDIS_HOST', 'wm_redis'),
          port: configService.get<number>('REDIS_PORT', 6379),
          db: configService.get<number>('REDIS_DB', 3),
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            if (times > 3) return null
            return Math.min(times * 200, 2000)
          },
        })
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
