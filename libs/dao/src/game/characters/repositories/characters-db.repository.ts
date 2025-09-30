import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { CharacterEntity } from '@libs/dao/game/characters/entities/character.entity';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';
import { FilterValue } from '@libs/common/dto/pagination-in.dto';

export type CharactersDbRepositories = Record<string, CharactersRepository>;

@EntityRepository(CharacterEntity)
export class CharactersDbRepository
  extends AbstractRepository<CharacterEntity>
  implements CharactersRepository
{
  async findByUserId(userId: number): Promise<Character[]> {
    return await this.queryBuilder
      .where(`${this.alias}.userId = :userId`, { userId: userId })
      .getMany();
  }

  async findByUserIdAndDataCharacterId(
    userId: number,
    dataCharacterId: number,
  ): Promise<Character> {
    return await this.queryBuilder
      .where(`${this.alias}.userId = :userId`, { userId: userId })
      .andWhere(`${this.alias}.dataCharacterId = :dataCharacterId`, {
        dataCharacterId: dataCharacterId,
      })
      .getOne();
  }

  async findByUserIdAndDataCharacterIdIn(
    userId: number,
    dataCharacterIds: number[],
  ): Promise<Character[]> {
    return await this.queryBuilder
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .andWhere(`${this.alias}.dataCharacterId In(:dataCharacterIds)`, {
        dataCharacterIds: dataCharacterIds,
      })
      .getMany();
  }

  async updateLevelById(id: number, level: number): Promise<void> {
    await this.queryBuilder
      .update(this.alias)
      .set({ level })
      .where(`${this.alias}.id=:id`, { id })
      .execute();
  }

  async findAllWithFilterAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
    filter?: Record<string, FilterValue>,
  ): Promise<[Character[], number]> {
    const qb = this.queryBuilder;

    return await this.applyDynamicFilters(qb, filter)
      .take(take)
      .skip(skip)
      .orderBy(`${qb.alias}.id`, orderBy)
      .getManyAndCount();
  }
}
