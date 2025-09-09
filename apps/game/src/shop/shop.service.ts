import { Injectable } from '@nestjs/common';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { GachaInDto } from './dto/gacha-in.dto';
import { GachaOutDto } from './dto/gacha-out.dto';
import { GachaProvider } from '@libs/common/provider/gacha/gacha.provider';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { MISSION_CONDITION_TYPE } from '@libs/dao/static/common.constants';
import { Transactional } from '@libs/common/decorator/transaction.decorator';

@Injectable()
export class ShopService {
  constructor(
    private readonly gachaProvider: GachaProvider,
    private readonly goodsProvider: GoodsProvider,
  ) {}

  @Transactional()
  async gacha(gachaInDto: GachaInDto): Promise<GachaOutDto> {
    const { dataGachaId, count } = gachaInDto;

    const [rewards, costId] = await this.gachaProvider.drawRewards(
      dataGachaId,
      count,
    );

    const gachaCharacterIds = rewards.map((it) => it.dataId);
    const consumedGoods = await this.goodsProvider.consumeByDataCostId(costId, {
      addValue: count,
    });

    const rewardGoods = await this.goodsProvider.payImmediately(rewards);

    AchievementProvider.achieve(MISSION_CONDITION_TYPE.GACHA, [], count);

    return GachaOutDto.of({
      goods: this.goodsProvider.merge(consumedGoods, rewardGoods),
      gachaCharacterIds,
    });
  }
}
