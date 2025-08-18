import { Inject, Injectable } from '@nestjs/common';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { RedisDbNumber } from '@libs/common/constants/redis.constants';
import { DeveloperNotesRepository } from '@libs/dao/common/developer-notes/interfaces/developer-notes-repository.interface';
import { DeveloperNote } from '@libs/dao/common/developer-notes/interfaces/developer-note.interface';

@Injectable()
export class DeveloperNotesRedisRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.DEVELOPER_NOTE;

  private readonly developerNoteListKey = 'developer_notes:list'; // ID만 저장하는 리스트
  private readonly developerNoteItemKeyPrefix = 'developer_notes:item:'; // 각각의 Idea

  constructor(
    @Inject(DeveloperNotesRepository)
    private readonly developerNotesRepository: DeveloperNotesRepository,
  ) {
    super();
    this.createRedisClient();
  }

  async get(skip: number, take: number): Promise<[DeveloperNote[], number]> {
    const start = skip;
    const end = start + take - 1;

    // Redis에 ID 리스트 존재 여부 확인
    const hasList = await this.redis.exists(this.developerNoteListKey);

    if (!hasList) {
      const allIdeas = await this.developerNotesRepository.find();

      const ideaIds = allIdeas.map((idea) => idea.id).sort();
      if (ideaIds.length > 0) {
        await this.redis.rpush(this.developerNoteListKey, ...ideaIds);
      }

      const pipeline = this.redis.pipeline();
      for (const idea of allIdeas) {
        pipeline.set(
          `${this.developerNoteItemKeyPrefix}${idea.id}`,
          JSON.stringify(idea),
        );
      }
      await pipeline.exec();
    }

    // 전체 아이템 개수
    const totalCount = await this.redis.llen(this.developerNoteListKey);

    // ID 리스트에서 페이지 범위만큼 가져오기
    const ids = await this.redis.lrange(this.developerNoteListKey, start, end);
    if (ids.length === 0) return [[], totalCount];

    const keys = ids.map((id) => `${this.developerNoteItemKeyPrefix}${id}`);
    const rawIdeas = await this.redis.mget(...keys);

    const ideas = rawIdeas
      .map((item) => (item ? JSON.parse(item) : null))
      .filter((item): item is DeveloperNote => item !== null);

    return [ideas, totalCount];
  }
}
