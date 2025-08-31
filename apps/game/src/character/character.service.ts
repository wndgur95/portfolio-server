import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { CharacterDto } from '@libs/dao/game/characters/dto/character.dto';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { CharactersDbRepositories } from '@libs/dao/game/characters/repositories/characters-db.repository';

@Injectable()
export class CharacterService {
  constructor(
    @Inject(CharactersRepository)
    private readonly charactersDbRepositories: CharactersDbRepositories,
  ) {}

  /**
   * 캐릭터 정보 받기
   */
  async getCharacter(): Promise<CharacterDto[]> {
    const { database, userId } = ContextProvider.getSession();

    const characters =
      await this.charactersDbRepositories[database].findByUserId(userId);

    return CharacterDto.fromEntities(characters);
  }
}
