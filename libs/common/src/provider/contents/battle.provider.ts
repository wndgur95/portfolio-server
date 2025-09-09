import { Injectable } from '@nestjs/common';
import { DataBalanceRepository } from '@libs/dao/static/data-balance/data-balance.repository';
import {
  BATTLE_REWARD_KILL_BALANCE,
  BATTLE_REWARD_TIME_BALANCE,
} from '@libs/common/constants/battle.constants';
import { DataGoodsProvider } from '@libs/common/provider/static-data/data-goods.provider';
import { Reward } from '@libs/common/interface/goods.interface';

@Injectable()
export class BattleProvider {
  constructor(
    private readonly dataBalanceRepository: DataBalanceRepository,
    private readonly dataGoodsProvider: DataGoodsProvider,
  ) {}

  getBattleResultReward(time: number, kill: number): [Reward[], number] {
    const timeRewardId = this.dataBalanceRepository.findById(
      BATTLE_REWARD_TIME_BALANCE,
    ).INDEX[0];

    const killRewardId = this.dataBalanceRepository.findById(
      BATTLE_REWARD_KILL_BALANCE,
    ).INDEX[0];

    const rewards = [
      ...this.dataGoodsProvider.getRewardsByDataRewardId(timeRewardId, {
        addValue: time,
      }),
      ...this.dataGoodsProvider.getRewardsByDataRewardId(killRewardId, {
        addValue: kill,
      }),
    ];

    return [rewards, rewards.map((it) => it.quantity).sum()];
  }
}
