import { Module } from '@nestjs/common';
import { ThrottlerRedisRepository } from '@libs/dao/redis/throttler/throttler-redis.repository';

@Module({
  imports: [],
  providers: [ThrottlerRedisRepository],
  exports: [ThrottlerRedisRepository],
})
export class RedisModule {}
