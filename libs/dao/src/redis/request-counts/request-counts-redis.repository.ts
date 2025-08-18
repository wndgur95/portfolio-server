import { Injectable } from '@nestjs/common';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { RedisDbNumber } from '@libs/common/constants/redis.constants';

@Injectable()
export class RequestCountsRedisRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.REQUEST_COUNT;

  private readonly requestCountKeyPrefix = 'requestCount:'; // 각각의 Idea

  constructor() {
    super();
    this.createRedisClient();
  }

  async countRequest(userId: number): Promise<number> {
    const countKey = `${this.requestCountKeyPrefix}${userId}`;

    return this.redis.incr(countKey);
  }
}
