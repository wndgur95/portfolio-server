import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { CharacterDto } from '@libs/dao/game/characters/dto/character.dto';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { CharactersDbRepositories } from '@libs/dao/game/characters/repositories/characters-db.repository';
import { CharacterLevelUpInDto } from './dto/character-level-up-in.dto';
import { DataBalanceRepository } from '@libs/dao/static/data-balance/data-balance.repository';
import { DataBalance } from '@libs/dao/static/data-balance/data-balance.entity';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import {
  GOODS_TYPE,
  MISSION_CONDITION_TYPE,
} from '@libs/dao/static/common.constants';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { CharacterProvider } from '@libs/common/provider/contents/character.provider';

@Injectable()
export class CharacterService {
  constructor(
    @Inject(CharactersRepository)
    private readonly charactersDbRepositories: CharactersDbRepositories,

    private readonly dataBalanceRepository: DataBalanceRepository,
    private readonly goodsProvider: GoodsProvider,
    private readonly characterProvider: CharacterProvider,
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

    let character = await this.charactersDbRepositories[
      database
    ].findByUserIdAndDataCharacterId(userId, dataCharacterId);

    const needCount = this.dataBalanceRepository.findById(
      DataBalance.BALANCE_CHARACTER_LEVEL_UP,
    ).INDEX[character.level];

    character = await this._getCharacterAfterConsume(
      character.dataCharacterId,
      needCount,
    );

    await this.characterProvider.levelUpCharacter(
      character,
      character.level + 1,
    );

    AchievementProvider.achieve(
      MISSION_CONDITION_TYPE.CHARACTER_LEVEL_UP,
      [],
      1,
    );

    return character;
  }

  private async _getCharacterAfterConsume(
    dataCharacterId: number,
    needCount: number,
  ): Promise<CharacterDto> {
    const goodOutDto = await this.goodsProvider.consume([
      {
        goodsType: GOODS_TYPE.CHARACTER,
        dataId: dataCharacterId,
        quantity: needCount,
      },
    ]);

    return goodOutDto.characters[0];
  }
}
