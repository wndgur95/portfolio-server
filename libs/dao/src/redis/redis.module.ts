import { Module } from '@nestjs/common';
import { ThrottlerRedisRepository } from '@libs/dao/redis/throttler/throttler-redis.repository';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { SoloRankingRepository } from '@libs/dao/redis/solo-ranking/solo-ranking.repository';

@Module({
  providers: [
    ThrottlerRedisRepository,
    SessionRepository,
    SoloRankingRepository,
  ],
  exports: [ThrottlerRedisRepository, SessionRepository, SoloRankingRepository],
})
export class RedisModule {}
