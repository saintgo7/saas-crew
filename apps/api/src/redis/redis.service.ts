import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
import { REDIS_CLIENT } from './redis.module'

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onModuleDestroy() {
    await this.redis.quit()
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, 'EX', ttlSeconds)
    } else {
      await this.redis.set(key, value)
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key)
    if (!value) return null
    return JSON.parse(value)
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds)
  }

  getClient(): Redis {
    return this.redis
  }
}
