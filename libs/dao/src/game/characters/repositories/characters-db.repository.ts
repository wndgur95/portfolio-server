import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { CharacterEntity } from '@libs/dao/game/characters/entities/character.entity';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';

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
}
