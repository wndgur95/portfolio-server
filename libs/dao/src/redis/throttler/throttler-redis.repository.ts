import { Injectable } from '@nestjs/common';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { RedisDbNumber } from '@libs/common/constants/redis.constants';

@Injectable()
export class ThrottlerRedisRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.THROTTLER;

  constructor() {
    super();
    this.createRedisClient();
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.redis.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }
}
