import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { CharacterDto } from '@libs/dao/game/characters/dto/character.dto';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { CharactersDbRepositories } from '@libs/dao/game/characters/repositories/characters-db.repository';
import { CharacterLevelUpInDto } from './dto/character-level-up-in.dto';
import { DataBalanceRepository } from '@libs/dao/static/data-balance/data-balance.repository';
import { DataBalance } from '@libs/dao/static/data-balance/data-balance.entity';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';

@Injectable()
export class CharacterService {
  constructor(
    @Inject(CharactersRepository)
    private readonly charactersDbRepositories: CharactersDbRepositories,

    private readonly dataBalanceRepository: DataBalanceRepository,
  ) {}

  /**
   * 캐릭터 정보 받기
   */
  async getCharacters(): Promise<CharacterDto[]> {
    const { database, userId } = ContextProvider.getSession();

    const characters =
      await this.charactersDbRepositories[database].findByUserId(userId);

    return CharacterDto.fromEntities(characters);
  }

  /**
   * 캐릭터 정보 받기
   */
  async levelUpCharacter(
    characterLevelUpInDto: CharacterLevelUpInDto,
  ): Promise<Character> {
    const { database, userId } = ContextProvider.getSession();
    const { dataCharacterId } = characterLevelUpInDto;

    const character = await this.charactersDbRepositories[
      database
    ].findByUserIdAndDataCharacterId(userId, dataCharacterId);

    const needCount = this.dataBalanceRepository.findById(
      DataBalance.BALANCE_CHARACTER_LEVEL_UP,
    ).INDEX[character.level];

    if (needCount > character.count) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.CHARACTER_NOT_ENOUGH);
    }

    character.count -= needCount;
    character.level++;

    return await this.charactersDbRepositories[database].save(character);
  }
}
