import { flatten, Injectable } from '@nestjs/common';
import {
  RedisDbNumber,
  SOLO_RANKING_KEY,
} from '@libs/common/constants/redis.constants';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import {
  ScoreMemberDto,
  ScoreMemberDetail,
} from '@libs/dao/redis/solo-ranking/dto/score-member.dto';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { SoloScore } from '@libs/dao/arena/solo-scores/interfaces/solo-score.interface';

@Injectable()
export class SoloRankingRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.SOLO_RANKING;

  constructor() {
    super();
    this.createRedisClient();
  }

  async getTotalUserCountAndRank(
    key: string,
    userId: number,
  ): Promise<[number, number]> {
    const pipeline = this.pipeline();

    pipeline.zcount(key, '-inf', '+inf');

    pipeline.zrevrank(key, userId);

    const [totalUserCountResult, rankResult] = await pipeline.exec();

    const totalUserCount = Number(totalUserCountResult[1]);

    const rank = rankResult[1] === null ? 0 : Number(rankResult[1]) + 1;

    return [totalUserCount, rank];
  }

  async getTotalUserCountAndUserRankAndEnemyUserRank(
    key: string,
    userId: number,
    enemyUserId: number,
  ): Promise<[number, number, number]> {
    const pipeline = this.pipeline();

    pipeline.zcount(key, '-inf', '+inf');

    pipeline.zrevrank(key, userId);

    pipeline.zrevrank(key, enemyUserId);

    const [totalUserCountResult, userRankResult, enemyUserRankResult] =
      await pipeline.exec();

    const totalUserCount = Number(totalUserCountResult[1]);

    const userRank =
      userRankResult[1] === null ? 0 : Number(userRankResult[1]) + 1;

    const enemyUserRank =
      enemyUserRankResult[1] === null ? 0 : Number(enemyUserRankResult[1]) + 1;

    return [totalUserCount, userRank, enemyUserRank];
  }

  async getTotalUserCountAndRankAndScoreMemberByRank(
    key: string,
    userId: number,
    startRankIndex = 0,
    stopRankIndex = -1,
  ): Promise<[number, ScoreMemberDetail, ScoreMemberDetail[]]> {
    const pipeline = this.pipeline();

    pipeline.zcount(key, '-inf', '+inf');

    pipeline.zrevrank(key, userId);

    pipeline.zrevrange(key, startRankIndex, stopRankIndex, 'WITHSCORES');

    const [totalUserCountResult, rankResult, rangeWithScoresByRankResult] =
      await pipeline.exec();

    const totalUserCount = Number(totalUserCountResult[1]);

    const rank = rankResult[1] === null ? 0 : Number(rankResult[1]) + 1;
    const myScoreMember = await this.redis.get(`${SOLO_RANKING_KEY}:${userId}`);

    const scoreMembers = await this.createScoreMember(
      rangeWithScoresByRankResult[1] as string[],
      startRankIndex,
    );

    return [
      totalUserCount,
      ScoreMemberDetail.create({
        ...JSON.parse(myScoreMember),
        rank: rank,
      }),
      scoreMembers,
    ];
  }

  async getRankByUserIds(key: string, userIds: number[]): Promise<number[]> {
    const pipeline = this.pipeline();

    for (const userId of userIds) {
      pipeline.zrevrank(key, userId);
    }

    const result = await pipeline.exec();

    return result.map((it) => (it[1] === null ? 0 : Number(it[1]) + 1));
  }

  async getScoreMemberByScore(
    key: string,
    maxRedisScore: string | number,
    minRedisScore: string | number,
  ): Promise<ScoreMemberDetail[]> {
    const result = await this.redis.zrevrangebyscore(
      key,
      maxRedisScore,
      minRedisScore,
      'WITHSCORES',
    );

    return this.createScoreMember(result);
  }

  async getRank(key: string, userId: number): Promise<number> {
    const totalRank = await this.redis.zrevrank(key, userId);

    return totalRank === null ? 0 : totalRank + 1;
  }

  async addScores(key: string, scoreMembers: ScoreMemberDto[]): Promise<void> {
    await this.redis.zadd(
      key,
      ...flatten(scoreMembers.map((it) => [it.score, it.userId])),
    );
  }

  addScore(key: string, scoreMember: ScoreMemberDto): void {
    const multi = this.multi;
    multi.zadd(key, ...[scoreMember.score, scoreMember.userId]);

    ContextProvider.setRedisMulti(this.dbNumber, multi);
  }

  setSoloScore(key: string, soloScore: SoloScore): void {
    const multi = this.multi;

    multi.set(key, JSON.stringify(soloScore));

    ContextProvider.setRedisMulti(this.dbNumber, multi);
  }

  async createScoreMember(
    result: string[],
    startRankIndex = 0,
  ): Promise<ScoreMemberDetail[]> {
    const scoreMembers = [];

    let rank = startRankIndex + 1;

    const userIds = [];
    for (let i = 0; i < result.length; i += 2) {
      userIds.push(result[i]);
    }

    const values = await this.redis.mget(
      ...userIds.map((it) => `${SOLO_RANKING_KEY}:${it}`),
    );

    for (let i = 0; i < values.length; i++) {
      scoreMembers.push(
        ScoreMemberDetail.create({
          ...JSON.parse(values[i]),
          rank: rank,
        }),
      );

      rank++;
    }

    return scoreMembers;
  }
}
