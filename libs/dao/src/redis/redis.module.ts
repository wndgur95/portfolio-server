import { Module } from '@nestjs/common';
import { ThrottlerRedisRepository } from '@libs/dao/redis/throttler/throttler-redis.repository';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { SoloRankingRepository } from '@libs/dao/redis/solo-ranking/solo-ranking.repository';
import { SoloBattleRedisRepository } from '@libs/dao/redis/solo-battle/solo-battle-redis.repository';

@Module({
  providers: [
    ThrottlerRedisRepository,
    SessionRepository,
    SoloRankingRepository,
    SoloBattleRedisRepository,
  ],
  exports: [
    ThrottlerRedisRepository,
    SessionRepository,
    SoloRankingRepository,
    SoloBattleRedisRepository,
  ],
})
export class RedisModule {}
