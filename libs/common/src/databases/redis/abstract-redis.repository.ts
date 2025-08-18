import { Redis, RedisKey } from 'ioredis';
import { RedisFactory } from '@libs/common/databases/redis/redis.factory';
import { ChainableCommander } from 'ioredis/built/utils/RedisCommander';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { RedisDbNumber } from '@libs/common/constants/redis.constants';

export abstract class AbstractRedisRepository {
  protected redis: Redis;
  protected readonly dbNumber: RedisDbNumber;

  createRedisClient(): void {
    this.redis = RedisFactory.createRedisClient(this.dbNumber);
  }

  pipeline(): ChainableCommander {
    return this.redis.pipeline();
  }

  get multi(): ChainableCommander {
    const multi = ContextProvider.getRedisMulti(this.dbNumber);

    return multi || this.redis.multi();
  }

  async flushDb(): Promise<'OK'> {
    return this.redis.flushdb();
  }

  async quit(): Promise<'OK'> {
    return this.redis.quit();
  }

  async close(): Promise<'OK'> {
    return this.redis.quit();
  }

  async del(...args: [keys: string[]] | [...keys: string[]]): Promise<number> {
    return this.redis.del(args as string[]);
  }

  async ttl(key: RedisKey): Promise<number> {
    return this.redis.ttl(key);
  }

  async zrem(key: RedisKey, member: number[]): Promise<number> {
    return this.redis.zrem(key, member);
  }

  async allKeys(): Promise<string[]> {
    return this.redis.keys('*');
  }
}
