import { Inject, Injectable } from '@nestjs/common';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { RedisDbNumber } from '@libs/common/constants/redis.constants';
import { IdeasRepository } from '@libs/dao/common/ideas/interfaces/ideas-repository.interface';
import { Idea } from '@libs/dao/common/ideas/interfaces/idea.interface';
import { IdeaDoItsDbRepositories } from '@libs/dao/user/idea-do-its/repositories/idea-do-its-db.repository';
import { IdeaDoItsRepository } from '@libs/dao/user/idea-do-its/interfaces/idea-do-its-repository.interface';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { IdeaDoIt } from '@libs/dao/user/idea-do-its/interfaces/idea-do-it.interface';

@Injectable()
export class IdeasRedisRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.IDEA;

  private readonly ideaListKey = 'ideas:list'; // ID만 저장하는 리스트
  private readonly ideaItemKeyPrefix = 'ideas:item:'; // 각각의 Idea
  private readonly ideaDoItKeyPrefix = 'ideas:doIt:'; // 각각의 Idea

  constructor(
    @Inject(IdeasRepository)
    private readonly ideasRepository: IdeasRepository,

    @Inject(IdeaDoItsRepository)
    private readonly ideaDoItsDbRepositories: IdeaDoItsDbRepositories,
  ) {
    super();
    this.createRedisClient();
  }

  async get(skip: number, take: number): Promise<[Idea[], number[], number]> {
    const start = skip;
    const end = start + take - 1;

    await this._setEmptyList();

    // 전체 아이템 개수
    const totalCount = await this.redis.llen(this.ideaListKey);

    // ID 리스트에서 페이지 범위만큼 가져오기
    const ids = await this.redis.lrange(this.ideaListKey, start, end);
    if (ids.length === 0) return [[], [], totalCount];

    const itemKeys = ids.map((id) => `${this.ideaItemKeyPrefix}${id}`);
    const doItKeys = ids.map((id) => `${this.ideaDoItKeyPrefix}${id}`);
    const rawIdeas = await this.redis.mget(...itemKeys);
    const rawIdeaDoIts = await this.redis.mget(...doItKeys);

    const ideas = rawIdeas.map((item) => (item ? JSON.parse(item) : null));

    const doIts = rawIdeaDoIts.map((doIt) => (doIt ? Number(doIt) : 0));

    return [ideas, doIts, totalCount];
  }

  async getDoItCountByIds(ids: number[]): Promise<number[]> {
    await this._setEmptyList();

    const doItKeys = ids.map((id) => `${this.ideaDoItKeyPrefix}${id}`);
    const rawIdeaDoIts = await this.redis.mget(...doItKeys);

    return rawIdeaDoIts.map((doIt) => (doIt ? Number(doIt) : 0));
  }

  async getDoItCountById(id: number): Promise<number> {
    await this._setEmptyList();

    const doIt = await this.redis.mget(`${this.ideaDoItKeyPrefix}${id}`);

    return doIt[0] ? Number(doIt[0]) : 0;
  }

  async delIdea(ideaId: number): Promise<void> {
    const multi = this.multi;

    // 1. 리스트에서 ID 제거
    multi.lrem(this.ideaListKey, 0, ideaId);

    // 2. 아이디어 및 doIt 관련 데이터 삭제
    multi.del(`${this.ideaItemKeyPrefix}${ideaId}`);
    multi.del(`${this.ideaDoItKeyPrefix}${ideaId}`);

    ContextProvider.setRedisMulti(this.dbNumber, multi);
  }

  private async _setEmptyList(): Promise<void> {
    // Redis에 ID 리스트 존재 여부 확인
    const hasList = await this.redis.exists(this.ideaListKey);

    if (hasList) return;

    const allIdeas = await this.ideasRepository.find();
    const ideaDoItCountMap = new Map<number, number>();

    for (const database of getUserShardDatabases) {
      const ideaDoIts = await this.ideaDoItsDbRepositories[database].findBy({
        doIt: true,
      });

      for (const doIt of ideaDoIts) {
        const count = ideaDoItCountMap.get(doIt.ideaId) ?? 0;
        ideaDoItCountMap.set(doIt.ideaId, count);
      }
    }

    const ideaIds = allIdeas.map((idea) => idea.id).sort();
    if (ideaIds.length > 0) {
      await this.redis.rpush(this.ideaListKey, ...ideaIds);
    }

    const pipeline = this.redis.pipeline();
    for (const idea of allIdeas) {
      pipeline.set(`${this.ideaItemKeyPrefix}${idea.id}`, JSON.stringify(idea));
      const doItCount = ideaDoItCountMap.get(idea.id) ?? 0;
      pipeline.set(`${this.ideaDoItKeyPrefix}${idea.id}`, doItCount.toString());
    }
    await pipeline.exec();
  }

  async set(idea: Idea): Promise<void> {
    const multi = this.multi;

    const ideaKey = `${this.ideaItemKeyPrefix}${idea.id}`;
    const doItKey = `${this.ideaDoItKeyPrefix}${idea.id}`;

    // 1. 아이디어 데이터를 저장 (덮어쓰기)
    multi.set(ideaKey, JSON.stringify(idea));
    const existDoIt = await this.redis.exists(doItKey);

    if (!existDoIt) {
      multi.set(doItKey, '0');
    }

    // 2. ID 리스트에 중복 확인 후 없으면 추가
    const exists = await this.redis.lpos(this.ideaListKey, idea.id);

    if (exists === null) {
      multi.rpush(this.ideaListKey, idea.id); // 또는 lpush (정렬 방식에 따라 선택)
    }

    ContextProvider.setRedisMulti(this.dbNumber, multi);
  }

  async countDoIt(ideaDoIt: IdeaDoIt): Promise<void> {
    const multi = this.multi;

    const countKey = `${this.ideaDoItKeyPrefix}${ideaDoIt.ideaId}`;

    if (ideaDoIt.doIt) {
      multi.incr(countKey);
    } else {
      multi.decr(countKey);
    }

    ContextProvider.setRedisMulti(this.dbNumber, multi);
  }
}
