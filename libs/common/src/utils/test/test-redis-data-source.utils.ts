import { TestingModule } from '@nestjs/testing';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { RedisFactory } from '@libs/common/databases/redis/redis.factory';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { BatchMessageRepository } from '@libs/dao/redis/batch-message/batch-message.repository';
import { ChattingRepository } from '@libs/dao/redis/chatting/chatting.repository';
import { SoloBattleRedisRepository } from '@libs/dao/redis/solo-battle/solo-battle-redis.repository';
import { SoloRankingRepository } from '@libs/dao/redis/solo-ranking/solo-ranking.repository';
import { ThrottlerRedisRepository } from '@libs/dao/redis/throttler/throttler-redis.repository';
import { RedisHelper } from '@libs/common/databases/redis/redis.helper';

export class TestRedisDataSourceUtils {
  /**
   * 모든 레디스 정보 클리어
   */
  static async clearRedisDataSource(module: TestingModule): Promise<void> {
    await TestRedisDataSourceUtils.redisFlushDb(module);

    const allClient = RedisFactory.getAllRedisClient();

    await Promise.all(
      allClient.map(async (client) => {
        if (client.status === 'ready') {
          await client.unsubscribe();
        }
        return client.quit();
      }),
    );
  }

  /**
   * 레디스 데이터 초기화
   */
  static async redisFlushDb(module: TestingModule): Promise<void> {
    const redisDataSourceMap =
      TestRedisDataSourceUtils.getRedisRepositories(module);

    await Promise.all(redisDataSourceMap.map((it) => it.flushDb()));
  }

  /**
   * 모든 레디스 레포지토리 조회
   */
  static getRedisRepositories(
    module: TestingModule,
  ): AbstractRedisRepository[] {
    const redisDataSourceMap = [];

    // session
    try {
      const sessionRepository =
        module.get<SessionRepository>(SessionRepository);
      redisDataSourceMap.push(sessionRepository);
    } catch (_) {
      /* empty */
    }

    // batch message
    try {
      const batchMessageRepository = module.get<BatchMessageRepository>(
        BatchMessageRepository,
      );
      redisDataSourceMap.push(batchMessageRepository);
    } catch (_) {
      /* empty */
    }

    // chatting
    try {
      const chattingRepository =
        module.get<ChattingRepository>(ChattingRepository);
      redisDataSourceMap.push(chattingRepository);
    } catch (_) {
      /* empty */
    }

    // solo battle
    try {
      const soloBattleRedisRepository = module.get<SoloBattleRedisRepository>(
        SoloBattleRedisRepository,
      );

      redisDataSourceMap.push(soloBattleRedisRepository);
    } catch (_) {
      /* empty */
    }

    // solo ranking
    try {
      const soloRankingRepository = module.get<SoloRankingRepository>(
        SoloRankingRepository,
      );

      redisDataSourceMap.push(soloRankingRepository);
    } catch (_) {
      /* empty */
    }

    // throttler
    try {
      const throttlerRedisRepository = module.get<ThrottlerRedisRepository>(
        ThrottlerRedisRepository,
      );

      redisDataSourceMap.push(throttlerRedisRepository);
    } catch (_) {
      /* empty */
    }

    return redisDataSourceMap;
  }

  static async redisExec(): Promise<void> {
    await RedisHelper.commitMulti();
  }
}
