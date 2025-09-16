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

  findByUserIdAndDataCharacterIdIn(
    userId: number,
    dataCharacterIds: number[],
  ): Promise<Character[]>;

  updateLevelById(id: number, level: number): Promise<void>;
}

export const CharactersRepository = Symbol('CharactersRepository');
