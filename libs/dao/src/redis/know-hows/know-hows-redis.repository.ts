import { Inject, Injectable } from '@nestjs/common';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { RedisDbNumber } from '@libs/common/constants/redis.constants';
import { Idea } from '@libs/dao/common/ideas/interfaces/idea.interface';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { KnowHowsRepository } from '@libs/dao/common/know-hows/interfaces/know-hows-repository.interface';
import { KnowHowRecommendsRepository } from '@libs/dao/user/know-how-recommends/interfaces/know-how-recommends-repository.interface';
import { KnowHowRecommendsDbRepositories } from '@libs/dao/user/know-how-recommends/repositories/know-how-recommends-db.repository';
import { KnowHow } from '@libs/dao/common/know-hows/interfaces/know-how.interface';
import { KnowHowRecommend } from '@libs/dao/user/know-how-recommends/interfaces/know-how-recommend.interface';

@Injectable()
export class KnowHowsRedisRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.KNOW_HOW;

  private readonly knowHowListKey = 'know_hows:list'; // ID만 저장하는 리스트
  private readonly knowHowItemKeyPrefix = 'know_hows:item:'; // 각각의 Idea
  private readonly knowHowRecommendKeyPrefix = 'know_hows:recommend:'; // 각각의 Idea

  constructor(
    @Inject(KnowHowsRepository)
    private readonly knowHowsRepository: KnowHowsRepository,

    @Inject(KnowHowRecommendsRepository)
    private readonly knowHowRecommendsDbRepositories: KnowHowRecommendsDbRepositories,
  ) {
    super();
    this.createRedisClient();
  }

  async get(
    skip: number,
    take: number,
  ): Promise<[KnowHow[], number[], number]> {
    const start = skip;
    const end = start + take - 1;

    await this._setEmptyList();

    // 전체 아이템 개수
    const totalCount = await this.redis.llen(this.knowHowListKey);

    // ID 리스트에서 페이지 범위만큼 가져오기
    const ids = await this.redis.lrange(this.knowHowListKey, start, end);
    if (ids.length === 0) return [[], [], totalCount];

    const itemKeys = ids.map((id) => `${this.knowHowItemKeyPrefix}${id}`);
    const recommendKeys = ids.map(
      (id) => `${this.knowHowRecommendKeyPrefix}${id}`,
    );
    const rawKnowHows = await this.redis.mget(...itemKeys);
    const rawKnowHowRecommends = await this.redis.mget(...recommendKeys);

    const knowHows = rawKnowHows.map((item) =>
      item ? JSON.parse(item) : null,
    );

    const recommends = rawKnowHowRecommends.map((doIt) =>
      doIt ? Number(doIt) : 0,
    );

    return [knowHows, recommends, totalCount];
  }

  async getRecommendCountByIds(ids: number[]): Promise<number[]> {
    await this._setEmptyList();

    const recommendKeys = ids.map(
      (id) => `${this.knowHowRecommendKeyPrefix}${id}`,
    );
    const rawRecommends = await this.redis.mget(...recommendKeys);

    return rawRecommends.map((recommend) =>
      recommend ? Number(recommend) : 0,
    );
  }

  async getRecommendCountById(id: number): Promise<number> {
    await this._setEmptyList();

    const recommend = await this.redis.mget(
      `${this.knowHowRecommendKeyPrefix}${id}`,
    );

    return recommend[0] ? Number(recommend[0]) : 0;
  }

  async delKnowHow(ideaId: number): Promise<void> {
    const multi = this.multi;

    // 1. 리스트에서 ID 제거
    multi.lrem(this.knowHowListKey, 0, ideaId);

    // 2. 아이디어 및 doIt 관련 데이터 삭제
    multi.del(`${this.knowHowItemKeyPrefix}${ideaId}`);
    multi.del(`${this.knowHowRecommendKeyPrefix}${ideaId}`);

    ContextProvider.setRedisMulti(this.dbNumber, multi);
  }

  private async _setEmptyList(): Promise<void> {
    // Redis에 ID 리스트 존재 여부 확인
    const hasList = await this.redis.exists(this.knowHowListKey);

    if (hasList) return;

    const allKnowHows = await this.knowHowsRepository.find();
    const knowHowRecommendCountMap = new Map<number, number>();

    for (const database of getUserShardDatabases) {
      const ideaDoIts = await this.knowHowRecommendsDbRepositories[
        database
      ].findBy({
        recommend: true,
      });

      for (const doIt of ideaDoIts) {
        const count = knowHowRecommendCountMap.get(doIt.knowHowId) ?? 0;
        knowHowRecommendCountMap.set(doIt.knowHowId, count);
      }
    }

    const knowHowIds = allKnowHows.map((knowHow) => knowHow.id).sort();
    if (knowHowIds.length > 0) {
      await this.redis.rpush(this.knowHowListKey, ...knowHowIds);
    }

    const pipeline = this.redis.pipeline();
    for (const idea of allKnowHows) {
      pipeline.set(
        `${this.knowHowItemKeyPrefix}${idea.id}`,
        JSON.stringify(idea),
      );
      const recommendCount = knowHowRecommendCountMap.get(idea.id) ?? 0;
      pipeline.set(
        `${this.knowHowRecommendKeyPrefix}${idea.id}`,
        recommendCount.toString(),
      );
    }
    await pipeline.exec();
  }

  async set(idea: Idea): Promise<void> {
    const multi = this.multi;

    const knowHowKey = `${this.knowHowItemKeyPrefix}${idea.id}`;
    const recommendKey = `${this.knowHowRecommendKeyPrefix}${idea.id}`;

    // 1. 아이디어 데이터를 저장 (덮어쓰기)
    multi.set(knowHowKey, JSON.stringify(idea));
    const existRecommend = await this.redis.exists(recommendKey);

    if (!existRecommend) {
      multi.set(recommendKey, '0');
    }

    // 2. ID 리스트에 중복 확인 후 없으면 추가
    const exists = await this.redis.lpos(this.knowHowListKey, idea.id);

    if (exists === null) {
      multi.rpush(this.knowHowListKey, idea.id); // 또는 lpush (정렬 방식에 따라 선택)
    }

    ContextProvider.setRedisMulti(this.dbNumber, multi);
  }

  async countRecommend(knowHowRecommend: KnowHowRecommend): Promise<void> {
    const multi = this.multi;

    const countKey = `${this.knowHowRecommendKeyPrefix}${knowHowRecommend.knowHowId}`;

    if (knowHowRecommend.recommend) {
      multi.incr(countKey);
    } else {
      multi.decr(countKey);
    }

    ContextProvider.setRedisMulti(this.dbNumber, multi);
  }
}
