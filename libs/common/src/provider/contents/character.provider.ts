import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { CharactersDbRepositories } from '@libs/dao/game/characters/repositories/characters-db.repository';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';

@Injectable()
export class CharacterProvider {
  constructor(
    @Inject(CharactersRepository)
    private readonly charactersRepositories: CharactersDbRepositories,
  ) {}

  /**
   * 캐릭터 조회
   */
  async getCharacters(): Promise<Character[]> {
    const { userId, database } = ContextProvider.getUserInfo();

    return await this.charactersRepositories[database].findByUserId(userId);
  }

  /**
   * 캐릭터 조회 data character id 로
   */
  async getCharactersByDataCharacterIds(
    dataCharacterIds: number[],
  ): Promise<Character[]> {
    const { userId, database } = ContextProvider.getUserInfo();

    return await this.charactersRepositories[
      database
    ].findByUserIdAndDataCharacterIdIn(userId, dataCharacterIds);
  }

  /**
   * 캐릭터 저장
   */
  async saveCharacters(
    characters: Character[],
    reload = false,
  ): Promise<Character[]> {
    const { database } = ContextProvider.getUserInfo();

    return await this.charactersRepositories[database].save(characters, {
      reload,
    });
  }

  /**
   * 캐릭터 레벨 설정
   */
  async levelUpCharacter(
    character: Character,
    level: number,
  ): Promise<Character> {
    character.level = level;
    const { database } = ContextProvider.getUserInfo();

    await this.charactersRepositories[database].updateLevelById(
      character.id,
      character.level,
    );

    return character;
  }
}
