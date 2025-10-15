import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';
import { GOODS_TYPE } from '@libs/dao/static/common.constants';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { DataCharacter } from '@libs/dao/static/data-character/data-character.entity';
import { getDatabaseByGameDbId } from '@libs/dao/config/game/game-database-config.util';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';
import { CharactersDbRepository } from '@libs/dao/game/characters/repositories/characters-db.repository';
import { CharacterEntity } from '@libs/dao/game/characters/entities/character.entity';

const dataCharacterRepository = new DataCharacterRepository();

export class TestCharacterUtils {
  /**
   * 단일 캐릭터 생성
   */
  static async createCharacter(
    goodsProvider: GoodsProvider,
    dataCharacterId?: number,
  ): Promise<Character> {
    const dataCharacter = dataCharacterId
      ? dataCharacterRepository.findById(dataCharacterId)
      : dataCharacterRepository.values()[0];

    const goodsDto = await goodsProvider.payImmediately([
      {
        goodsType: GOODS_TYPE.CHARACTER,
        dataId: dataCharacter.ID,
        quantity: 1,
      },
    ]);

    return goodsDto.characters[0];
  }

  /**
   * 모든 캐릭터 생성
   */
  static async createAllCharacters(
    goodsProvider: GoodsProvider,
    quantity = 1,
  ): Promise<Character[]> {
    const rewards = dataCharacterRepository.values().map((it) => {
      return {
        goodsType: GOODS_TYPE.CHARACTER,
        dataId: it.ID,
        quantity: quantity,
      };
    });

    const goodsDto = await goodsProvider.payImmediately(rewards);

    return goodsDto.characters;
  }

  /**
   * 다른 유저 캐릭터 생성
   */
  static async createOtherUserCharacter(
    userId: number,
    gameDbId: number,
    dataCharacterId = 0,
  ): Promise<Character> {
    let dataCharacter: DataCharacter;

    if (dataCharacterId !== 0) {
      dataCharacter = dataCharacterRepository.findById(dataCharacterId);
    } else {
      dataCharacter = dataCharacterRepository.values()[0];
    }

    const database = getDatabaseByGameDbId(gameDbId);

    const characterRepository = CharactersDbRepository.instance(database);

    const character = CharacterEntity.create({
      userId: userId,
      dataCharacterId: dataCharacter.ID,
    });

    await characterRepository.insert(character);

    return character;
  }

  /**
   * 다른 유저 모든 캐릭터 생성
   */
  static async createOtherUserAllCharacters(
    userId: number,
    gameDbId: number,
  ): Promise<Character[]> {
    const database = getDatabaseByGameDbId(gameDbId);

    const characterRepository = CharactersDbRepository.instance(database);

    const characters = dataCharacterRepository.values().map((it) => {
      return CharacterEntity.create({
        userId: userId,
        dataCharacterId: it.ID,
      });
    });

    await characterRepository.insert(characters);

    return characters;
  }
}
