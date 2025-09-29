import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerRedisRepository } from '@libs/dao/redis/throttler/throttler-redis.repository';

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private throttlerRedisRepository: ThrottlerRedisRepository;

  constructor() {
    this.throttlerRedisRepository = new ThrottlerRedisRepository();
  }

  async increment(key: string, ttl: number, limit: number, blockDuration: number): Promise<{ totalHits: number; ttl: number; timeToExpire: number; isBlocked: boolean; timeToBlockExpire: number }> {
    try {
      // Redis에서 현재 요청 수 확인
      const currentHits = await this.throttlerRedisRepository.get(key);
      const hits = currentHits ? parseInt(currentHits) : 0;

      // 요청 수 증가
      const newHits = await this.throttlerRedisRepository.incr(key);
      
      // TTL 설정 (첫 번째 요청인 경우에만)
      if (hits === 0) {
        await this.throttlerRedisRepository.expire(key, Math.ceil(ttl / 1000));
      }

      const timeToExpire = await this.throttlerRedisRepository.ttl(key) * 1000; // 밀리초로 변환
      const isBlocked = newHits > limit;
      const timeToBlockExpire = isBlocked ? blockDuration : 0;

      return {
        totalHits: newHits,
        ttl: ttl,
        timeToExpire,
        isBlocked,
        timeToBlockExpire,
      };
    } catch (error) {
      console.error('Redis Throttle Storage Error:', error);
      // Redis 오류 시 기본값 반환
      return {
        totalHits: 0,
        ttl: ttl,
        timeToExpire: 0,
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    }
  }

  async get(key: string): Promise<{ totalHits: number; ttl: number }> {
    try {
      const currentHits = await this.throttlerRedisRepository.get(key);
      const ttl = await this.throttlerRedisRepository.ttl(key);
      
      return {
        totalHits: currentHits ? parseInt(currentHits) : 0,
        ttl: ttl > 0 ? ttl * 1000 : 0, // TTL을 밀리초로 변환
      };
    } catch (error) {
      console.error('Redis Throttle Storage Get Error:', error);
      return {
        totalHits: 0,
        ttl: 0,
      };
    }
  }

  async reset(key: string): Promise<void> {
    try {
      await this.throttlerRedisRepository.del(key);
    } catch (error) {
      console.error('Redis Throttle Storage Reset Error:', error);
    }
  }
} 