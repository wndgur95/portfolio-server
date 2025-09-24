import { flatten, Injectable } from '@nestjs/common';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { DataCurrencyRepository } from '@libs/dao/static/data-currency/data-currency.repository';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';
import { GOODS_TYPE, GoodsType } from '@libs/dao/static/common.constants';
import { ObjectUtil } from '@libs/common/utils/object.util';
import { UserDetailProvider } from '@libs/common/provider/contents/user-detail.provider';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { CurrencyDto } from '@libs/dao/game/user-details/dto/currency.dto';
import { Cost } from '@libs/common/interface/goods.interface';
import { CURRENCY_PROPS } from '@libs/dao/game/user-details/type/currency';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { CharacterProvider } from '@libs/common/provider/contents/character.provider';
import { CharacterDto } from '@libs/dao/game/characters/dto/character.dto';
import { MongoLogProvider } from '@libs/common/provider/mongo-log/mongo-log.provider';
import { ConsumeCurrencyCollection } from '@libs/dao/mongo/mongo-log/collection/goods/consume-currency.collection';
import { ConsumeCharacterCollection } from '@libs/dao/mongo/mongo-log/collection/goods/consume-character.collection';

type DelegateFunctionReturn = CurrencyDto | CharacterDto;

type ConsumeDelegate = Partial<
  Record<GoodsType, (materials: Cost[]) => Promise<DelegateFunctionReturn[]>>
>;

@Injectable()
export class ConsumptionProvider {
  private readonly consumeDelegate: ConsumeDelegate = {
    [GOODS_TYPE.CURRENCY]: (
      materials: Cost[],
    ): Promise<DelegateFunctionReturn[]> => this._consumeCurrency(materials),

    [GOODS_TYPE.CHARACTER]: (
      materials: Cost[],
    ): Promise<DelegateFunctionReturn[]> => this._consumeCharacter(materials),
  };

  constructor(
    private readonly userDetailProvider: UserDetailProvider,
    private readonly dataCurrencyRepository: DataCurrencyRepository,
    private readonly characterProvider: CharacterProvider,
    private readonly dataCharacterProvider: DataCharacterProvider,
  ) {}

  /**
   * 소모
   */
  async consume(materials: Cost[]): Promise<GoodsOutDto> {
    const materialMap = new Map<GoodsType, Cost[]>();

    for (const material of materials) {
      const goodsType = material.goodsType;
      materialMap.has(goodsType)
        ? materialMap.get(goodsType).push(material)
        : materialMap.set(goodsType, [material]);
    }

    const results = [];
    for (const [goodsType, materials] of [...materialMap]) {
      const func = this.consumeDelegate[goodsType];
      if (!func) {
        throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
          `${goodsType}타입은 소모 할수 없는 재화 입니다.`,
        ]);
      }
      results.push(await func(materials));
    }

    return await this._distinctGoods(flatten(results));
  }

  /**
   * 통화 소모 by enumId
   */
  private async _consumeCurrency(materials: Cost[]): Promise<CurrencyDto[]> {
    const userDetail = await this.userDetailProvider.getUserDetail();

    // 각 material 의 재화는 이전에 통합을 통해 독립적인 dataId(currency Type)으로 들어온다.
    for (const material of materials) {
      const dataCurrency = this.dataCurrencyRepository.findById(
        material.dataId,
      );

      if (!dataCurrency) {
        throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
          `${material.dataId}는 재화 데이터에 존재하지 않은 아이디 입니다.`,
        ]);
      }

      const currencyProp = CURRENCY_PROPS[dataCurrency.CURRENCY_TYPE];
      if (!currencyProp) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.USER_DETAIL_UNKNOWN_CURRENCY_TYPE,
        );
      }

      // 통화 수량 확인
      if (userDetail.currency[currencyProp] < material.quantity) {
        const errorCode = `USER_DETAIL_CURRENCY_${currencyProp.toUpperCase()}_NOT_ENOUGH`;
        throw new ServerErrorException(INTERNAL_ERROR_CODE[errorCode]);
      }

      userDetail.currency[currencyProp] -= material.quantity;
    }

    await this.userDetailProvider.updateUserDetail(userDetail);

    MongoLogProvider.setMongoLog(
      'consume-currency',
      new ConsumeCurrencyCollection({
        userDetail,
      }),
    );

    return [CurrencyDto.fromEntity(userDetail.currency)];
  }

  /**
   * 통화 소모 by enumId
   */
  private async _consumeCharacter(materials: Cost[]): Promise<CharacterDto[]> {
    const dataIds = materials.map((it) => it.dataId);
    const characters =
      await this.characterProvider.getCharactersByDataCharacterIds(dataIds);

    const characterByDataCharacterId = Object.fromEntries(
      characters.map((it) => [it.dataCharacterId, it]),
    );

    for (const material of materials) {
      const { dataId, quantity } = material;
      const character = characterByDataCharacterId[dataId];

      const dataCharacter = this.dataCharacterProvider.getDataCharacter(dataId);

      if (!dataCharacter) {
        throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
          `${dataId}는 캐릭터 데이터에 존재하지 않은 아이디 입니다.`,
        ]);
      }

      if (!character) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.CHARACTER_NOT_FOUND,
          [dataId],
        );
      }

      // 통화 수량 확인
      if (character.count < quantity) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.CHARACTER_NOT_ENOUGH,
          [dataId],
        );
      }

      character.count -= quantity;
    }

    await this.characterProvider.saveCharacters(characters);

    MongoLogProvider.setMongoLog(
      'consume-character',
      characters.map(
        (it) =>
          new ConsumeCharacterCollection({
            character: it,
          }),
      ),
    );

    return CharacterDto.fromEntities(characters);
  }

  /**
   * 중복 재화 처리
   */
  private async _distinctGoods(
    results: DelegateFunctionReturn[],
  ): Promise<GoodsOutDto> {
    // 통화 중복 처리
    const currencyDto = await this._distinctCurrency(
      results.filter((it) => it instanceof CurrencyDto) as CurrencyDto[],
    );

    const goodsDto = GoodsOutDto.of({
      currency: currencyDto,
      characters: results.filter(
        (it) => it instanceof CharacterDto,
      ) as CharacterDto[],
    });

    return ObjectUtil.removeEmptyProperties(goodsDto);
  }

  /**
   * 중복 통화 처리
   */
  private async _distinctCurrency(
    currenciesDto: CurrencyDto[],
  ): Promise<CurrencyDto> {
    if (currenciesDto.isEmpty()) {
      return null;
    }

    if (currenciesDto.length === 1) {
      return currenciesDto[0];
    }

    const userDetail = await this.userDetailProvider.getUserDetail();

    return CurrencyDto.fromEntity(userDetail.currency);
  }
}
