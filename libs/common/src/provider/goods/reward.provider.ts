import { flatten, Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { DataCurrencyRepository } from '@libs/dao/static/data-currency/data-currency.repository';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';
import { GOODS_TYPE, GoodsType } from '@libs/dao/static/common.constants';
import { ObjectUtil } from '@libs/common/utils/object.util';
import { Reward } from '@libs/common/interface/goods.interface';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { UserDetailDto } from '@libs/dao/game/user-details/dto/user-detail.dto';
import { CurrencyDto } from '@libs/dao/game/user-details/dto/currency.dto';
import { CharacterDto } from '@libs/dao/game/characters/dto/character.dto';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { CharactersDbRepositories } from '@libs/dao/game/characters/repositories/characters-db.repository';
import { UserDetailProvider } from '@libs/common/provider/contents/user-detail.provider';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { UserDetailEntity } from '@libs/dao/game/user-details/entities/user-detail.entity';
import { CURRENCY_PROPS } from '@libs/dao/game/user-details/type/currency';
import { CharacterEntity } from '@libs/dao/game/characters/entities/character.entity';
import { MongoLogProvider } from '@libs/common/provider/mongo-log/mongo-log.provider';
import { PayCurrencyCollection } from '@libs/dao/mongo/mongo-log/collection/goods/pay-currency.collection';
import { PayCharacterCollection } from '@libs/dao/mongo/mongo-log/collection/goods/pay-character.collection';
import { MONGO_LOG_COLLECTION } from '@libs/common/constants/mongo-log.constants';

type DelegateFunctionReturn = UserDetailDto | CurrencyDto | CharacterDto;

type RewardDelegate = Partial<
  Record<GoodsType, (rewards: Reward[]) => Promise<DelegateFunctionReturn[]>>
>;

@Injectable()
export class RewardProvider {
  private readonly rewardDelegate: RewardDelegate;

  constructor(
    @Inject(CharactersRepository)
    private readonly charactersRepositories: CharactersDbRepositories,

    private readonly userDetailProvider: UserDetailProvider,
    private readonly dataCharacterProvider: DataCharacterProvider,

    private readonly dataCurrencyRepository: DataCurrencyRepository,
  ) {
    this.rewardDelegate = {
      [GOODS_TYPE.CURRENCY]: (rewards): Promise<DelegateFunctionReturn[]> =>
        this._payCurrency(rewards),
      [GOODS_TYPE.CHARACTER]: (rewards): Promise<DelegateFunctionReturn[]> =>
        this._payCharacter(rewards),
    };
  }

  /**
   * 재화 지급 (유저 경험치 제외)
   * */
  async pay(rewards: Reward[]): Promise<DelegateFunctionReturn[]> {
    if (rewards.isEmpty()) {
      return [];
    }

    const rewardMap = new Map<GoodsType, Reward[]>();
    for (const reward of rewards) {
      const goodsType = reward.goodsType;

      rewardMap.has(goodsType)
        ? rewardMap.get(goodsType).push(reward)
        : rewardMap.set(goodsType, [reward]);
    }

    const results: DelegateFunctionReturn[][] = [];
    for (const [goodsType, rewards] of [...rewardMap]) {
      const func = this.rewardDelegate[goodsType];
      if (!func) {
        throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
          `${goodsType}타입은 지급 할수 없는 재화 입니다.`,
        ]);
      }

      results.push(await func(rewards));
    }

    return flatten(results);
  }

  /**
   * 중복 재화 처리
   */
  async distinctGoods(results: DelegateFunctionReturn[]): Promise<GoodsOutDto> {
    // 유저 경험치 & 통화 중복 처리
    const userDetailDto = await this._distinctUserDetail(
      results.filter((it) => it instanceof UserDetailDto) as UserDetailDto[],
      results.filter((it) => it instanceof CurrencyDto) as CurrencyDto[],
    );

    const goodsOutDto = GoodsOutDto.of({
      currency: userDetailDto?.currency,
      characters: results.filter(
        (it) => it instanceof CharacterDto,
      ) as CharacterDto[],
    });

    return ObjectUtil.removeEmptyProperties(goodsOutDto);
  }

  /**
   * 재화 지급
   * */
  private async _payCurrency(rewards: Reward[]): Promise<CurrencyDto[]> {
    const dataCurrencyIds = rewards.map((it) => it.dataId);

    this.dataCurrencyRepository.findByIdIn(dataCurrencyIds);

    const userDetail = await this.userDetailProvider.getUserDetail();

    for (const reward of rewards) {
      const dataCurrency = this.dataCurrencyRepository.findById(reward.dataId);
      const currencyProp = CURRENCY_PROPS[dataCurrency.CURRENCY_TYPE];
      if (currencyProp) {
        userDetail.currency[currencyProp] += reward.quantity;
      }
    }

    await this.userDetailProvider.updateUserDetail(userDetail);

    MongoLogProvider.setMongoLog(
      MONGO_LOG_COLLECTION.PAT_CURRENCY,
      new PayCurrencyCollection({
        userDetail,
      }),
    );

    return [CurrencyDto.fromEntity(userDetail.currency)];
  }

  /**
   * 캐릭터 지급
   * - 캐릭터 중복 불 가능
   * */
  private async _payCharacter(rewards: Reward[]): Promise<CharacterDto[]> {
    const { database, userId } = ContextProvider.getUserInfo();

    const dataCharacterIds = rewards.map((it) => it.dataId);

    this.dataCharacterProvider.getDataCharacters(dataCharacterIds);

    let characters = await this.charactersRepositories[
      database
    ].findByUserIdAndDataCharacterIdIn(userId, dataCharacterIds);

    const characterByDataCharacterId = Object.fromEntries(
      characters.map((it) => [it.dataCharacterId, it]),
    );

    for (const reward of rewards) {
      const { dataId, quantity } = reward;
      let character = characterByDataCharacterId[dataId];

      if (!character || 0 >= character.level) {
        character = CharacterEntity.create({
          userId,
          dataCharacterId: dataId,
          level: 1,
          count: quantity - 1,
        });
      } else {
        character.count += quantity;
      }

      characterByDataCharacterId[dataId] = character;
    }

    const characterRepository = this.charactersRepositories[database];
    characters = await characterRepository.save(
      Object.values(characterByDataCharacterId),
    );

    MongoLogProvider.setMongoLog(
      MONGO_LOG_COLLECTION.PAT_CHARACTER,
      characters.map(
        (it) =>
          new PayCharacterCollection({
            character: it,
          }),
      ),
    );

    return CharacterDto.fromEntities(characters);
  }

  /**
   * 중복 유저 상세 정보 처리
   */
  private async _distinctUserDetail(
    userDetailsDto: UserDetailDto[],
    currenciesDto: CurrencyDto[],
  ): Promise<UserDetailDto> {
    if (userDetailsDto.isEmpty() && currenciesDto.isEmpty()) {
      return null;
    }

    if (userDetailsDto.isEmpty() && currenciesDto.isNotEmpty()) {
      return UserDetailDto.fromEntity(
        UserDetailEntity.create({
          currency: currenciesDto[0],
        }),
      );
    }

    if (currenciesDto.isEmpty() && userDetailsDto.length === 1) {
      return userDetailsDto[0];
    }

    const userDetail = await this.userDetailProvider.getUserDetail();

    return UserDetailDto.fromEntity(userDetail);
  }
}
