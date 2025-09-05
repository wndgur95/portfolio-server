import { Injectable } from '@nestjs/common';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';
import { ConsumptionProvider } from '@libs/common/provider/goods/consumption.provider';
import { RewardProvider } from '@libs/common/provider/goods/reward.provider';
import { ObjectUtil } from '@libs/common/utils/object.util';
import {
  Cost,
  CostOptions,
  Reward,
  RewardOptions,
} from '@libs/common/interface/goods.interface';
import { DataGoodsProvider } from '@libs/common/provider/static-data/data-goods.provider';

@Injectable()
export class GoodsProvider {
  constructor(
    private readonly consumptionProvider: ConsumptionProvider,
    private readonly rewardProvider: RewardProvider,
    private readonly dataGoodsProvider: DataGoodsProvider,
  ) {}

  /**
   * 소모
   */
  async consume(costs: Cost[]): Promise<GoodsOutDto> {
    if (!costs || costs.isEmpty()) {
      return {};
    }

    // 재료 데이터 검증
    this.dataGoodsProvider.validateCosts(costs);

    // 재료 수량 병합
    const mergedCosts = this.dataGoodsProvider.mergeCosts(costs);

    // consume
    return await this.consumptionProvider.consume(mergedCosts);
  }

  /**
   * costId를 통해 소모
   */
  async consumeByDataCostId(
    costId: number,
    options?: CostOptions,
  ): Promise<GoodsOutDto> {
    if (!costId) {
      return {};
    }

    return await this.consume(
      this.dataGoodsProvider.getCostsByDataCostId(costId, options),
    );
  }

  /**
   * 재화 지급
   */
  async pay(
    rewardIds: number[],
    options?: RewardOptions,
  ): Promise<GoodsOutDto> {
    if (!rewardIds || rewardIds.isEmpty()) {
      return {};
    }

    const rewards = this.dataGoodsProvider.getRewardsByDataRewardIds(
      rewardIds,
      options,
    );

    return await this.payImmediately(rewards);
  }

  /**
   * 재화 즉시 지급
   * */
  async payImmediately(rewards: Reward[]): Promise<GoodsOutDto> {
    if (!rewards || rewards.isEmpty()) {
      return {};
    }

    // 보상 데이터 검증
    this.dataGoodsProvider.validateRewards(rewards);

    // 캐릭터 보상만 병합처리 - 레벨업 보상으로 생긴 캐릭터 병합
    const mergedRewards = this.dataGoodsProvider.mergeRewards(rewards);

    // 유저 경험치 외 지급
    const paidResult = await this.rewardProvider.pay(mergedRewards);

    // 중복 제거
    return await this.rewardProvider.distinctGoods(paidResult);
  }

  /**
   * 소모 재화 + 지급 재화 병합
   */
  merge(consumptionGoods: GoodsOutDto, rewardGoods: GoodsOutDto): GoodsOutDto {
    if (ObjectUtil.isEmpty(consumptionGoods)) {
      return rewardGoods;
    }

    if (ObjectUtil.isEmpty(rewardGoods)) {
      return consumptionGoods;
    }

    const goodsDto = GoodsOutDto.of({
      currency: rewardGoods.currency ?? consumptionGoods.currency,
      characters: rewardGoods.characters,
    });

    return ObjectUtil.removeEmptyProperties(goodsDto);
  }
}
