import { Injectable } from '@nestjs/common';
import { GOODS_TYPE, GoodsType } from '@libs/dao/static/common.constants';
import { DataReward } from '@libs/dao/static/data-reward/data-reward.entity';
import {
  Cost,
  CostOptions,
  Reward,
  RewardOptions,
} from '@libs/common/interface/goods.interface';
import { DataCurrencyRepository } from '@libs/dao/static/data-currency/data-currency.repository';
import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { DataCost } from '@libs/dao/static/data-cost/data-cost.entity';
import { DataCostRepository } from '@libs/dao/static/data-cost/data-cost.repository';
import { DataRewardRepository } from '@libs/dao/static/data-reward/data-reward.repository';
import { DataCurrency } from '@libs/dao/static/data-currency/data-currency.entity';

@Injectable()
export class DataGoodsProvider {
  constructor(
    private readonly dataCurrencyRepository: DataCurrencyRepository,
    private readonly dataCharacterRepository: DataCharacterRepository,
    private readonly dataCostRepository: DataCostRepository,
    private readonly dataRewardRepository: DataRewardRepository,
  ) {}

  /**
   * 단일 비용 데이터 조회
   */
  getDataCost(dataCostId: number): DataCost {
    const dataCost = this.dataCostRepository.findById(dataCostId);

    if (!dataCost) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `${dataCostId}는 비용 데이터에 존재하지 않은 아이디 입니다.`,
      ]);
    }

    return dataCost;
  }

  /**
   * 다중 비용 데이터 조회
   */
  getDataCosts(dataCostIds: number[]): DataCost[] {
    const dataCosts = this.dataCostRepository.findByIdIn(dataCostIds);

    if (dataCostIds.length !== dataCosts.length) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `요청된 ID 중 누락된 비용 데이터가 있습니다. 요청된 ID: ${dataCostIds.join(', ')}, 조회된 데이터 수: ${dataCosts.length}`,
      ]);
    }

    return dataCosts;
  }

  /**
   * 보상 데이터 조회
   */
  getDataReward(dataRewardId: number): DataReward {
    const dataReward = this.dataRewardRepository.findById(dataRewardId);

    if (!dataReward) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `${dataRewardId} 는 업는 Reward 데이터입니다.`,
      ]);
    }

    return dataReward;
  }

  /**
   * 다중 보상 데이터 조회
   */
  getDataRewards(dataRewardIds: number[]): DataReward[] {
    const dataReward = this.dataRewardRepository.findByIdIn(dataRewardIds);

    if (dataRewardIds.length !== dataReward.length) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `요청된 ID 중 누락된 보상 데이터가 있습니다. 요청된 ID: ${dataRewardIds.join(', ')}, 조회된 데이터 수: ${dataReward.length}`,
      ]);
    }

    return dataReward;
  }

  /**
   * 재화 데이터 조회
   */
  getDataCurrency(dataCurrencyId: number): DataCurrency {
    const dataCurrency = this.dataCurrencyRepository.findById(dataCurrencyId);

    if (!dataCurrency) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `${dataCurrencyId}는 재화 데이터에 존재하지 않은 아이디 입니다.`,
      ]);
    }

    return dataCurrency;
  }

  /**
   * 보상 데이터 아이디를 보상으로 변환
   */
  getRewardsByDataRewardId(
    dataRewardId: number,
    options?: RewardOptions,
  ): Reward[] {
    const dataReward = this.getDataReward(dataRewardId);

    return dataReward.GOODS_TYPE.map(
      (goodsType, i) => ({
        goodsType: goodsType as GoodsType,
        dataId: dataReward.GOODS_VALUE[i],
        quantity: dataReward.GOODS_COUNT[i] * (options?.addValue || 1),
      }),
    );
  }

  /**
   * 보상 데이터 아이디를 보상으로 변환
   */
  getRewardsByDataRewardIds(
    dataRewardIds: number[],
    options?: RewardOptions,
  ): Reward[] {
    return this.getDataRewards(dataRewardIds).flatMap((dataReward) => {
      const goodsRewards = dataReward.GOODS_TYPE.map((goodsType, i) => ({
        goodsType: goodsType as GoodsType,
        dataId: dataReward.GOODS_VALUE[i],
        quantity: dataReward.GOODS_COUNT[i] * (options?.addValue || 1),
      }));

      const bonusRewards = [];
      // dataReward.BONUS_TYPE.filter(
      //   (goodsType) => goodsType !== GOODS_TYPE.NONE,
      // ).map((goodsType, i) => ({
      //   goodsType: goodsType as GoodsType,
      //   dataId: dataReward.BONUS_VALUE[i],
      //   quantity: dataReward.BONUS_COUNT[i] * (options?.addValue || 1),
      // }));

      return [...goodsRewards, ...bonusRewards];
    });
  }

  /**
   * 비용 데이터 아이디를 보상으로 변환
   */
  getRewardsByDataCostIdIn(dataCostIds: number[]): Reward[] {
    return this.getDataCosts(dataCostIds).flatMap((dataCost) => {
      return dataCost.GOODS_TYPE.map((goodsType, i) => ({
        goodsType: goodsType as GoodsType,
        dataId: dataCost.GOODS_VALUE[i],
        quantity: dataCost.GOODS_COUNT[i],
      }));
    });
  }
  /**
   * 보상 병합
   */
  mergeRewards(rewards: Reward[]): Reward[] {
    if (rewards.isEmpty()) {
      return [];
    }

    const rewardsMap = new Map<string, Reward>();
    for (const reward of rewards) {
      const { goodsType, dataId, quantity } = reward;
      const key = `${reward.goodsType}_${reward.dataId}`;

      // goodsType 과 dataId 이 같은 데이터 합치기
      rewardsMap.has(key)
        ? (rewardsMap.get(key).quantity += quantity)
        : rewardsMap.set(key, {
            goodsType: goodsType,
            dataId: dataId,
            quantity: quantity,
          });
    }

    // 소수점 버림
    rewardsMap.forEach(
      (rewards) => (rewards.quantity = Math.floor(rewards.quantity)),
    );

    return [...rewardsMap.values()];
  }

  /**
   * 획득 보상 검증
   */
  validateRewards(rewards: Reward[]): void {
    for (const reward of rewards) {
      const { goodsType, dataId, quantity } = reward;

      if (0 > quantity) {
        throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
          `rewardId: ${reward.dataId} 보상 갯수가 0보다 작음`,
        ]);
      }

      this._validateGoodsDataId(goodsType, dataId);
    }
  }

  /**
   * 재화 데이터 아이디 검증
   */
  private _validateGoodsDataId(goodsType: GoodsType, dataId: number): void {
    if (!Object.values(GOODS_TYPE).includes(goodsType)) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `${goodsType} 값이 GoodsType 이 아님`,
      ]);
    }

    const dataRepositories = {
      [GOODS_TYPE.CURRENCY]: this.dataCurrencyRepository,
      [GOODS_TYPE.CHARACTER]: this.dataCharacterRepository,
    };

    if (!dataRepositories[goodsType]) {
      return;
    }

    if (!dataRepositories[goodsType].keys().includes(dataId)) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `저장소에 해당 데이터 아이디 ${dataId}가 존재하지 않음`,
      ]);
    }
  }

  getSelectableReward(dataRewardId: number, rewardSlotIndex: number): Reward {
    const dataReward = this.dataRewardRepository.findById(dataRewardId);

    if (
      !dataReward ||
      !dataReward.GOODS_TYPE[rewardSlotIndex] ||
      !dataReward.GOODS_VALUE[rewardSlotIndex] ||
      !dataReward.GOODS_COUNT[rewardSlotIndex]
    ) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `보상 데이터 ${dataRewardId}에 해당 인덱스 보상 슬롯 ${rewardSlotIndex}이 존재하지 않음`,
      ]);
    }

    return {
      goodsType: dataReward.GOODS_TYPE[rewardSlotIndex] as GoodsType,
      dataId: dataReward.GOODS_VALUE[rewardSlotIndex],
      quantity: dataReward.GOODS_COUNT[rewardSlotIndex],
    } satisfies Reward;
  }

  /**
   * 소모 재료 검증
   */
  validateCosts(costs: Cost[]): void {
    for (const cost of costs) {
      const { goodsType, dataId, quantity } = cost as Cost;

      // 수량 검증
      if (0 >= quantity) {
        throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
          '소모 수량이 0보다 작거나 같음',
        ]);
      }

      // 데이터 아이디 검증
      this._validateGoodsDataId(goodsType, dataId);
    }
  }

  /**
   * 재료 병합
   */
  mergeCosts(costs: Cost[]): Cost[] {
    if (costs.isEmpty()) {
      return [];
    }

    const remainCostsMap = new Map<string, Cost>();

    for (const cost of costs) {
      const { goodsType, dataId, quantity } = cost;
      const key = `${goodsType}_${dataId}`;

      remainCostsMap.has(key)
        ? (remainCostsMap.get(key).quantity += quantity)
        : remainCostsMap.set(key, {
            goodsType: goodsType,
            dataId: dataId,
            quantity: quantity,
          });
    }

    return [...remainCostsMap.values()];
  }

  /**
   * 비용 아이디로 재료를 변환
   */
  getCostsByDataCostId(dataCostId: number, options?: CostOptions): Cost[] {
    const dataCost = this.getDataCost(dataCostId);

    return dataCost.GOODS_TYPE.map((goodsType, i) => ({
      goodsType: goodsType as GoodsType,
      dataId: dataCost.GOODS_VALUE[i],
      quantity: dataCost.GOODS_COUNT[i] * (options?.addValue || 1),
    }));
  }
}
