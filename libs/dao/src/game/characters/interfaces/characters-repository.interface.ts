import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { CharacterEntity } from '@libs/dao/game/characters/entities/character.entity';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';

export interface CharactersRepository
  extends AbstractRepositoryInterface<CharacterEntity> {
  findByUserId(userId: number): Promise<Character[]>;

  findByUserIdAndDataCharacterId(
    userId: number,
    dataCharacterId: number,
  ): Promise<Character>;
}

export const CharactersRepository = Symbol('CharactersRepository');
