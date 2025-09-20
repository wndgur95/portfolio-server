import { Injectable } from '@nestjs/common';
import { RedisDbNumber } from '@libs/common/constants/redis.constants';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';

@Injectable()
export class ChattingRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.CHATTING;

  constructor() {
    super();
    this.createRedisClient();
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    return this.redis.setex(key, seconds, value);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }
}
