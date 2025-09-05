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

type DelegateFunctionReturn = CurrencyDto;

type ConsumeDelegate = Partial<
  Record<GoodsType, (materials: Cost[]) => Promise<DelegateFunctionReturn[]>>
>;

@Injectable()
export class ConsumptionProvider {
  private readonly consumeDelegate: ConsumeDelegate = {
    [GOODS_TYPE.CURRENCY]: (
      materials: Cost[],
    ): Promise<DelegateFunctionReturn[]> => this._consumeCurrency(materials),
  };

  constructor(
    private readonly userDetailProvider: UserDetailProvider,
    private readonly dataCurrencyRepository: DataCurrencyRepository,
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
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.DATA_INVALID,
          [`${goodsType}타입은 소모 할수 없는 재화 입니다.`],
        );
      }
      results.push(await func(materials));
    }

    return await this._distinctGoods(flatten(results));
  }

  /**
   * 통화 소모 by enumId
   */
  private async _consumeCurrency(
    materials: Cost[],
  ): Promise<CurrencyDto[]> {
    const userDetail = await this.userDetailProvider.getUserDetail();

    // 각 material 의 재화는 이전에 통합을 통해 독립적인 dataId(currency Type)으로 들어온다.
    for (const material of materials) {
      const dataCurrency = this.dataCurrencyRepository.findById(
        material.dataId,
      );

      if (!dataCurrency) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.DATA_INVALID,
          [`${material.dataId}는 재화 데이터에 존재하지 않은 아이디 입니다.`],
        );
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

    return [CurrencyDto.fromEntity(userDetail.currency)];
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
