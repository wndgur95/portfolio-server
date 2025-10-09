import { Injectable } from '@nestjs/common';
import { RedisDbNumber } from '@libs/common/constants/redis.constants';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';

@Injectable()
export class BatchMessageRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.BATCH_MESSAGE;

  constructor() {
    super();
    this.createRedisClient();
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  /**
   * 여러 개의 key를 한번에 가져오기
   */
  async mget(keys: string[]): Promise<(string | null)[]> {
    return this.redis.mget(...keys);
  }

  /**
   * 여러 개의 key와 value를 매핑하여 반환
   */
  async mgetAsMap(keys: string[]): Promise<Record<string, string | null>> {
    const values = await this.mget(keys);
    const result: Record<string, string | null> = {};
    
    keys.forEach((key, index) => {
      result[key] = values[index];
    });
    
    return result;
  }

  /**
   * 여러 개의 key 중에서 존재하는 것들만 가져오기
   */
  async mgetExisting(keys: string[]): Promise<Record<string, string>> {
    const values = await this.mget(keys);
    const result: Record<string, string> = {};
    
    keys.forEach((key, index) => {
      const value = values[index];
      if (value !== null) {
        result[key] = value;
      }
    });
    
    return result;
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    return this.redis.setex(key, seconds, value);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }
}
