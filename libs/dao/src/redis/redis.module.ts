import { Module } from '@nestjs/common';
import { ThrottlerRedisRepository } from '@libs/dao/redis/throttler/throttler-redis.repository';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';

@Module({
  imports: [],
  providers: [ThrottlerRedisRepository, SessionRepository],
  exports: [ThrottlerRedisRepository, SessionRepository],
})
export class RedisModule {}
